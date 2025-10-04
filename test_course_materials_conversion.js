// Test script to verify course materials conversion logic
// This can be run with: node test_course_materials_conversion.js

// Test data
const testMaterials = [
  { name: "document1.pdf", url: "/uploads/document1.pdf", type: "pdf" },
  {
    name: "presentation.pptx",
    url: "/uploads/presentation.pptx",
    type: "pptx",
  },
  { name: "spreadsheet.xlsx", url: "/uploads/spreadsheet.xlsx", type: "xlsx" },
];

// Function to convert array to comma-separated string (like in addCourseMaterials)
function arrayToString(materials) {
  return materials.map((m) => `${m.name},${m.url},${m.type}`).join(",");
}

// Function to convert comma-separated string back to array (like in getCourseMaterials)
function stringToArray(str) {
  if (!str || str.trim() === "") {
    return [];
  }

  const parts = str.split(",");
  const materials = [];

  for (let i = 0; i < parts.length; i += 3) {
    if (i + 2 < parts.length) {
      const name = parts[i]?.trim() || "material";
      const url = parts[i + 1]?.trim() || "";
      const type = parts[i + 2]?.trim() || "file";

      if (url) {
        materials.push({ name, url, type: type.toLowerCase() });
      }
    }
  }

  return materials;
}

// Test the conversion
console.log("Original materials:");
console.log(JSON.stringify(testMaterials, null, 2));

const commaSeparated = arrayToString(testMaterials);
console.log("\nComma-separated string:");
console.log(commaSeparated);

const convertedBack = stringToArray(commaSeparated);
console.log("\nConverted back to array:");
console.log(JSON.stringify(convertedBack, null, 2));

// Verify they match
const matches = JSON.stringify(testMaterials) === JSON.stringify(convertedBack);
console.log("\nConversion successful:", matches);

// Test edge cases
console.log("\n--- Testing edge cases ---");

// Empty array
const emptyArray = [];
const emptyString = arrayToString(emptyArray);
const emptyBack = stringToArray(emptyString);
console.log("Empty array test:", emptyBack.length === 0);

// Empty string
const emptyResult = stringToArray("");
console.log("Empty string test:", emptyResult.length === 0);

// Malformed string (missing parts)
const malformed = "name1,url1"; // Missing type
const malformedResult = stringToArray(malformed);
console.log("Malformed string test:", malformedResult.length === 0);

console.log("\nAll tests completed!");
