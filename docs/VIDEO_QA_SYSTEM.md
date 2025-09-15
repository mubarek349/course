# Video Q&A System Documentation

## Overview
The Video Q&A system allows students to ask questions about specific subactivity videos and instructors to respond to those questions. This enhances the learning experience by providing direct communication between students and instructors.

## Features

### For Students
- **Ask Questions**: Students can ask questions about any video they are watching
- **Timestamp Support**: Questions can be linked to specific moments in the video
- **View Responses**: Students can see instructor responses to their questions
- **Question Management**: Students can delete their own questions
- **Real-time Updates**: Questions and responses are updated in real-time

### For Instructors
- **View All Questions**: Instructors can see questions from all their courses
- **Filter by Course**: Questions can be filtered by specific courses
- **Search Functionality**: Search through questions by content or student name
- **Response Management**: Instructors can add, edit, and delete their responses
- **Status Tracking**: Track answered vs unanswered questions

## Database Schema

### VideoQuestion Table
- `id`: Unique identifier
- `studentId`: Reference to the student who asked the question
- `subActivityId`: Reference to the video subactivity
- `question`: The question text
- `timestamp`: Optional video timestamp where question was asked
- `createdAt`: When the question was created
- `updatedAt`: When the question was last updated

### VideoResponse Table
- `id`: Unique identifier
- `videoQuestionId`: Reference to the question being answered
- `instructorId`: Reference to the instructor who responded
- `response`: The response text
- `createdAt`: When the response was created
- `updatedAt`: When the response was last updated

## API Endpoints

### Student Actions (`/actions/student/videoqa.ts`)
- `submitVideoQuestion(subActivityId, question, timestamp)`: Submit a new question
- `getVideoQuestions(subActivityId)`: Get all questions for a video
- `deleteVideoQuestion(questionId)`: Delete a question (only by the student who asked it)

### Instructor Actions (`/actions/instructor/videoqa.ts`)
- `submitVideoResponse(videoQuestionId, response)`: Submit a response to a question
- `getInstructorVideoQuestions(courseId?)`: Get all questions for instructor's courses
- `updateVideoResponse(responseId, newResponse)`: Update an existing response
- `deleteVideoResponse(responseId)`: Delete a response

## Usage

### Student Interface
1. Navigate to any course video in the student dashboard
2. Select the \"Q&A\" tab below the video player
3. Click \"Ask Question\" to submit a new question
4. View existing questions and instructor responses
5. Questions are automatically linked to the current video timestamp

### Instructor Interface
1. Navigate to `/[lang]/@Instructor/videoqa` for all questions
2. Or go to `/[lang]/@Instructor/course/[id]/videoqa` for course-specific questions
3. Use search and filter options to find specific questions
4. Click \"Respond\" to answer unanswered questions
5. Click \"Add Response\" to provide additional responses
6. Edit or delete your existing responses as needed

## Security Features
- Students can only ask questions about videos they have purchased
- Students can only delete their own questions
- Instructors can only respond to questions from their own courses
- Instructors can only edit/delete their own responses
- All database operations include proper authorization checks

## Technical Implementation
- Built with Next.js App Router and React Server Actions
- Uses Prisma ORM for database operations
- HeroUI for consistent UI components
- TypeScript for type safety
- Real-time updates with revalidatePath

## Future Enhancements
- Real-time notifications for new questions/responses
- Email notifications for instructors
- Question upvoting system
- Advanced search with filters
- Question categories/tags
- Video transcript integration for context
- Mobile app support

## Installation
1. Database schema is automatically migrated with Prisma
2. Components are already integrated into the existing student and instructor interfaces
3. No additional configuration required

## Dependencies
- `date-fns`: For date formatting and relative time display
- `@heroui/react`: UI components
- `next-auth`: Authentication
- `prisma`: Database ORM