"use server";

import { 
  addCourseMaterials, 
  getCourseMaterials, 
  addAnnouncement, 
  getAnnouncements, 
  addFeedback, 
  getFeedback, 
  getAverageRating 
} from "../action/courseMaterials";

// Export all functions for use in components
export { 
  addCourseMaterials, 
  getCourseMaterials, 
  addAnnouncement, 
  getAnnouncements, 
  addFeedback, 
  getFeedback, 
  getAverageRating 
};