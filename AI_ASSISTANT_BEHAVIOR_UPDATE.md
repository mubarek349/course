# AI Assistant Behavior Update

## Overview
Updated the AI assistant to handle two key scenarios:
1. **No PDF provided**: AI responds directly using the selected AI provider
2. **Information not in PDF**: AI responds with "Please ask only about the course"

## Changes Made

### 1. Modified `lib/actions.ts`

#### Function: `askCourseQuestion`
- **Previous Behavior**: Returned an error when no PDF was found
- **New Behavior**: 
  - If no PDF is provided, uses the selected AI provider (Gemini/OpenAI) to answer the question directly
  - The AI acts as a general assistant without course material restrictions
  - Still respects the course's selected AI provider

```typescript
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
```

### 2. Modified `lib/ask.ts`

#### Function: `askLLM`
- **Updated**: Now handles empty context arrays (no course materials)
- **Behavior**:
  - With context: Acts as a course assistant limited to provided materials
  - Without context: Acts as a general AI assistant

```typescript
// If no context is provided, use general AI response
const hasContext = context && context.length > 0

const prompt = hasContext
  ? `Answer the question based only on the following course content:\n\n${context.join('\n\n')}\n\nQuestion: ${question}`
  : question
```

#### Function: `askLLMWithPDFs`
- **Enhanced Prompts**: Updated both OpenAI and Gemini prompts to be more explicit
- **Detection Logic**: Added checks to detect when information is not found in course materials
- **Response Handling**: Returns "Please ask only about the course." when:
  - Response contains "cannot find"
  - Response contains "not in the pdf"
  - Response contains "not in the course materials"
  - Response contains "not found in"
  - Response contains "no information"

**Updated System Instructions:**

For **OpenAI**:
```typescript
content: 'You are a helpful course assistant. You must answer questions based ONLY on the content shown in the PDF images provided. Extract and use specific information from the images. If information is not found in the images, respond with EXACTLY: "I cannot find this information in the course materials". Never make up information that is not visible in the images.'
```

For **Gemini**:
```typescript
systemInstruction: 'You are a helpful course assistant. You must answer questions based ONLY on the content provided in the PDF document. Extract specific information, provide detailed explanations, and quote relevant sections. If information is not in the PDF, respond with EXACTLY: "I cannot find this information in the course materials". Never make up information that is not in the PDF.'
```

**Detection Logic (Applied to both OpenAI and Gemini responses):**
```typescript
// Check if the AI couldn't find information in the course materials
if (response.toLowerCase().includes('cannot find') || 
    response.toLowerCase().includes('not in the pdf') ||
    response.toLowerCase().includes('not in the course materials') ||
    response.toLowerCase().includes('not found in') ||
    response.toLowerCase().includes('no information')) {
  return 'Please ask only about the course.'
}
```

## User Experience

### Scenario 1: No PDF Uploaded
- **Student asks**: "What is machine learning?"
- **AI Response**: Provides a general answer about machine learning
- **Benefit**: Students can still get help even without uploaded course materials

### Scenario 2: PDF Uploaded, Question Not Related to Course
- **Student asks**: "What is the weather like today?"
- **AI tries to find answer in PDF**: Cannot find weather information
- **AI Response**: "Please ask only about the course."
- **Benefit**: Keeps conversations focused on course content

### Scenario 3: PDF Uploaded, Question About Course
- **Student asks**: "What is covered in chapter 3?"
- **AI finds answer in PDF**: Locates chapter 3 content
- **AI Response**: Detailed answer with quotes from the PDF
- **Benefit**: Accurate, source-based responses

## Technical Benefits

1. **Flexibility**: AI can function with or without course materials
2. **Accuracy**: Responses are based on actual course content when available
3. **User Guidance**: Clear message when questions are off-topic
4. **Provider Agnostic**: Works with both Gemini and OpenAI
5. **Consistent Behavior**: Same logic applied to both AI providers

## Testing Recommendations

1. Test with no PDF uploaded (should use general AI)
2. Test with PDF uploaded and course-related question (should answer from PDF)
3. Test with PDF uploaded and unrelated question (should say "Please ask only about the course")
4. Test with both Gemini and OpenAI providers
5. Test edge cases (partially related questions, ambiguous queries)

## Implementation Date
October 20, 2025

