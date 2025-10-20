'use server'

import { embedQuery, embedChunks } from '@/lib/embed'
import { queryRelevantChunks, saveChunks } from '@/lib/chroma'
import { askLLM, askLLMWithPDFs, AIProvider, PDFFile } from '@/lib/ask'
import { 
  getCachedEmbeddings, 
  setCachedEmbeddings, 
  getCachedResponse, 
  setCachedResponse,
  getCachedContent,
  setCachedContent
} from '@/lib/cache'
import { writeFile, readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { createHash } from 'crypto'

// Simple text chunking function
function chunkText(text: string, chunkSize: number = 10000): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }
  return chunks
}

// Ask question using course-specific AI PDF data
export async function askCourseQuestion(
  courseId: string, 
  question: string
) {
  try {
    console.log('🤖 askCourseQuestion called:', { courseId, question: question.substring(0, 50) })
    
    const prisma = (await import('@/lib/db')).default
    
    // Get the course with AI PDF data
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { pdfData: true, aiProvider: true }
    })
    
    const aiProvider = (course?.aiProvider as AIProvider) || 'gemini'
    
    // If no PDF is provided, use the selected AI to respond directly
    if (!course?.pdfData) {
      console.log('⚠️ No PDF found, using AI provider directly:', aiProvider)
      
      const { askLLM } = await import('@/lib/ask')
      const directAnswer = await askLLM(question, [], aiProvider)
      
      return {
        success: true,
        answer: directAnswer,
        aiProvider
      }
    }
    
    const filename = course.pdfData
    
    console.log('📄 Reading PDF file:', filename, 'with provider:', aiProvider)
    
    // Generate cache key based on courseId and question
    const contentHash = createHash('md5').update(courseId + filename).digest('hex')
    
    // Check cache first
    const cachedResponse = await getCachedResponse(question, contentHash, aiProvider)
    if (cachedResponse) {
      console.log('✅ Using cached response for question')
      return { 
        success: true, 
        answer: cachedResponse, 
        aiProvider 
      }
    }
    
    // Read the PDF file from filesystem
    const filePath = join(process.cwd(), 'docs', 'ai-pdfs', filename)
    const pdfBuffer = await readFile(filePath)
    const base64Data = pdfBuffer.toString('base64')
    
    console.log(`✅ PDF loaded, size: ${base64Data.length} chars`)
    
    // Create PDF metadata for AI processing
    const pdfMetadata: PDFFile = {
      fileName: filename,
      mimeType: 'application/pdf',
      base64Data: base64Data,
      aiProvider: aiProvider,
      uploadedAt: new Date().toISOString()
    }
    
    console.log('🤖 Calling AI with PDF data...')
    
    // Use the AI to answer the question
    const answer = await askLLMWithPDFs(question, [pdfMetadata], aiProvider)
    
    console.log('✅ AI response received, length:', answer.length)
    
    // Cache the response
    await setCachedResponse(question, contentHash, aiProvider, answer)
    
    return { 
      success: true, 
      answer, 
      aiProvider 
    }
  } catch (error) {
    console.error('❌ Error asking course question:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to process question: ${errorMessage}` }
  }
}

export async function askQuestion(question: string, aiProvider?: AIProvider) {
  try {
    // Read all files from data folder and process them
    const dataFolder = join(process.cwd(), 'data')
    const files = await readdir(dataFolder)
    
    if (files.length === 0) {
      return { success: false, error: 'No files uploaded yet. Please upload a file first.' }
    }
    
    // Process all files and get their content
    let allContent = ''
    let detectedAiProvider: AIProvider = 'gemini' // default
    const pdfFiles: PDFFile[] = []
    let contentHash = ''
    
    for (const file of files) {
      const filePath = join(dataFolder, file)
      
      // Handle PDF files (stored as JSON with base64 data)
      if (file.endsWith('.pdf.json')) {
        const pdfData = JSON.parse(await readFile(filePath, 'utf-8'))
        pdfFiles.push(pdfData)
        detectedAiProvider = pdfData.aiProvider || 'gemini'
        contentHash += pdfData.base64Data.substring(0, 100) // Use first 100 chars for hash
      }
      // Handle text files
      else {
        const content = await readFile(filePath, 'utf-8')
        
        // Extract AI provider from metadata if present
        if (content.startsWith('AI_PROVIDER:')) {
          const lines = content.split('\n')
          const providerLine = lines[0]
          const provider = providerLine.replace('AI_PROVIDER:', '').trim() as AIProvider
          if (provider === 'gemini' || provider === 'openai') {
            detectedAiProvider = provider
          }
          // Remove metadata line from content
          allContent += lines.slice(2).join('\n') + '\n\n'
        } else {
          allContent += content + '\n\n'
        }
        contentHash += content.substring(0, 100) // Use first 100 chars for hash
      }
    }
    
    // Use provided AI provider or detected one
    const finalAiProvider = aiProvider || detectedAiProvider
    
    // Generate content hash for caching
    const fullContentHash = createHash('md5').update(contentHash).digest('hex')
    
    // Check cache for AI response first
    const cachedResponse = await getCachedResponse(question, fullContentHash, finalAiProvider)
    if (cachedResponse) {
      console.log('Using cached response for question:', question.substring(0, 50) + '...')
      return { success: true, answer: cachedResponse, aiProvider: finalAiProvider }
    }
    
    // If we have PDF files, process them directly with the selected AI provider
    if (pdfFiles.length > 0) {
      const answer = await askLLMWithPDFs(question, pdfFiles, finalAiProvider)
      
      // Cache the response
      await setCachedResponse(question, fullContentHash, finalAiProvider, answer)
      
      return { success: true, answer, aiProvider: finalAiProvider }
    }
    
    // For text files or OpenAI, use the traditional embedding approach with caching
    if (allContent.trim()) {
      // Check cache for embeddings
      const cachedEmbeddings = await getCachedEmbeddings(allContent)
      let embeddings: number[][]
      
      if (cachedEmbeddings) {
        console.log('Using cached embeddings for content')
        embeddings = cachedEmbeddings
      } else {
        console.log('Generating new embeddings for content')
        // Create embeddings for the content
        const chunks = chunkText(allContent)
        embeddings = await embedChunks(chunks)
        
        // Cache the embeddings
        await setCachedEmbeddings(allContent, embeddings)
      }
      
      await saveChunks(chunkText(allContent), embeddings)
      
      // Now answer the question
      const queryEmbedding = await embedQuery(question)
      const contextChunks = await queryRelevantChunks(queryEmbedding)
      const answer = await askLLM(question, contextChunks.filter(Boolean) as string[], finalAiProvider)
      
      // Cache the response
      await setCachedResponse(question, fullContentHash, finalAiProvider, answer)
      
      return { success: true, answer, aiProvider: finalAiProvider }
    }
    
    return { success: false, error: 'No readable content found in uploaded files.' }
  } catch (error) {
    console.error('Error asking question:', error)
    return { success: false, error: 'Failed to process question' }
  }
}

export async function uploadFile(formData: FormData) {
  try {
    console.log('📤 uploadFile called')
    const file = formData.get('file') as File
    const aiProvider = (formData.get('aiProvider') as AIProvider) || 'gemini'
    const courseId = formData.get('courseId') as string | null
    
    console.log('📋 Upload params:', { 
      hasFile: !!file, 
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      aiProvider, 
      courseId 
    })
    
    if (!file) {
      console.error('❌ No file provided')
      return { success: false, error: 'No file provided' }
    }
    
    if (!courseId) {
      console.error('❌ No courseId provided')
      return { success: false, error: 'Course ID is required' }
    }
    
    let text: string
    let fileName: string
    
    // Handle PDF files - convert to base64 for both Gemini and OpenAI
    if (file.type === 'application/pdf') {
      console.log('📄 Processing PDF file...')
      
      // Validate file size (15MB limit for AI processing)
      if (file.size > 15 * 1024 * 1024) {
        console.error('❌ File too large:', file.size)
        return { 
          success: false, 
          error: 'File size must be less than 15MB for optimal AI processing' 
        }
      }

      console.log('🔄 Converting PDF to base64...')
      // For both Gemini and OpenAI, we'll store the PDF as base64
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString('base64')
      
      console.log(`✅ Base64 conversion complete (${base64.length} chars)`)
      
     
      // If courseId is provided, save file and store filename in database
      console.log('💾 Saving file and storing filename in database for course:', courseId)
      
      // Save the actual PDF file to filesystem
      const { mkdir } = await import('fs/promises')
      const uploadsDir = join(process.cwd(), 'docs', 'ai-pdfs')
      
      try {
        await mkdir(uploadsDir, { recursive: true })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Directory might already exist
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const uniqueFilename = `${timestamp}-${sanitizedName}`
      const filePath = join(uploadsDir, uniqueFilename)
      
      // Write PDF file to disk
      await writeFile(filePath, buffer)
      console.log(`📁 PDF file saved to: ${filePath}`)
      
      const prisma = (await import('@/lib/db')).default
      const { revalidatePath } = await import('next/cache')
      
      // Store only the filename in database
      await prisma.course.update({
        where: { id: courseId },
        data: { 
          pdfData: uniqueFilename,
          aiProvider: aiProvider
        },
      })
      
      console.log(`✅ AI PDF filename stored in database for course ${courseId} with ${aiProvider} provider`)
      
      // Revalidate the course registration page
      revalidatePath(`/[lang]/@manager/course/registration/${courseId}`)
      revalidatePath('/[lang]/@manager/course/registration')
      
      return { 
        success: true,
        pdfData: uniqueFilename,
        fileName: uniqueFilename,
        message: `AI PDF uploaded successfully! Using ${aiProvider === 'openai' ? 'OpenAI' : 'Gemini'} AI.`
      }
    }
    // Handle text files
    else if (file.type === 'text/plain') {
      text = await file.text()
      
      // Process the extracted text
      if (!text || text.trim().length === 0) {
        return { 
          success: false, 
          error: 'The file appears to be empty or contains no readable text.'
        }
      }
      
      // Generate file hash for caching
      const fileHash = createHash('md5').update(text).digest('hex')
      
      // Check if we already have this content cached
      const cachedContent = await getCachedContent(fileHash)
      if (cachedContent) {
        console.log('Using cached content for file:', file.name)
        text = cachedContent
      } else {
        // Cache the content
        await setCachedContent(fileHash, text)
      }
      
      // Save file to data folder with AI provider metadata
      const dataFolder = join(process.cwd(), 'data')
      fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}.txt`
      const filePath = join(dataFolder, fileName)
      
      // Add AI provider metadata to the content
      const contentWithMetadata = `AI_PROVIDER: ${aiProvider}\n\n${text}`
      
      await writeFile(filePath, contentWithMetadata, 'utf-8')
      
      return { 
        success: true, 
        message: `Text file saved successfully as ${fileName}. You can now ask questions about it using ${aiProvider === 'gemini' ? 'Gemini' : 'OpenAI'} AI.`
      }
    }
    // Unsupported file type
    else {
      console.error('❌ Unsupported file type:', file.type)
      return { 
        success: false, 
        error: `Unsupported file type: ${file.type}. Please upload a PDF (.pdf) or text (.txt) file.`
      }
    }
  } catch (error) {
    console.error('❌ Error uploading file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { 
      success: false, 
      error: `Failed to process file: ${errorMessage}` 
    }
  }
}