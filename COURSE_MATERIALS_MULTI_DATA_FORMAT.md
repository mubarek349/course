# Course Materials - Multi-Data Format

## ✅ Updated to Triplet Format

All course materials functions have been updated to use the **multi-data triplet format** instead of just URLs.

---

## **Data Format**

### **Database Storage** (Comma-separated triplets):
```
"Document.pdf,/api/files/materials/123.pdf,pdf,Video.mp4,/api/files/materials/456.mp4,video,Slide.ppt,/api/files/materials/789.ppt,presentation"
```

**Pattern**: `name1,url1,type1,name2,url2,type2,name3,url3,type3,...`

### **In-Memory (Array of Objects)**:
```typescript
[
  { name: "Document.pdf", url: "/api/files/materials/123.pdf", type: "pdf" },
  { name: "Video.mp4", url: "/api/files/materials/456.mp4", type: "video" },
  { name: "Slide.ppt", url: "/api/files/materials/789.ppt", type: "presentation" }
]
```

---

## **Updated Functions**

### **1. `getCourseMaterials()` - lib/action/courseMaterials.ts**

**Parses triplets from database:**
```typescript
// Input: "name1,url1,type1,name2,url2,type2"
// Output: [{name, url, type}, {name, url, type}]

const parts = raw.split(',');
for (let i = 0; i < parts.length; i += 3) {
  if (i + 2 < parts.length) {
    materials.push({
      name: parts[i].trim(),
      url: parts[i + 1].trim(),
      type: parts[i + 2].trim()
    });
  }
}
```

---

### **2. `addCourseMaterials()` - lib/action/courseMaterials.ts**

**Saves triplets to database:**
```typescript
// Parse existing triplets
const parts = currentMaterials.split(',');
for (let i = 0; i < parts.length; i += 3) {
  // Parse existing materials
}

// Add new materials
const sanitized = materials.map(m => ({
  name: m.name?.trim() || m.url.split("/").pop() || "material",
  url: m.url.trim(),
  type: (m.type || "file").toLowerCase()
}));

// Combine and deduplicate by URL
// Convert to triplet format
const commaSeparated = uniqueByUrl
  .map(m => `${m.name},${m.url},${m.type}`)
  .join(',');
```

---

### **3. `deleteCourseMaterial()` - actions/manager/course-materials.ts**

**Removes material from triplet list:**
```typescript
// Parse triplets
const parts = currentMaterials.split(',');
for (let i = 0; i < parts.length; i += 3) {
  materials.push({
    name: parts[i].trim(),
    url: parts[i + 1].trim(),
    type: parts[i + 2].trim()
  });
}

// Filter out deleted material
const updatedMaterials = materials.filter(m => !m.url.includes(filename));

// Convert back to triplet format
const materialsString = updatedMaterials
  .map(m => `${m.name},${m.url},${m.type}`)
  .join(',');
```

---

### **4. Course Registration Page - Load Materials**

**Parse triplets when loading course:**
```typescript
// Format: "name1,url1,type1,name2,url2,type2"
const parts = data.courseMaterials.split(',').map(p => p.trim());
const materialsArray = [];

// Process in groups of 3
for (let i = 0; i < parts.length; i += 3) {
  if (i + 2 < parts.length) {
    materialsArray.push({
      name: parts[i] || 'material',
      url: parts[i + 1] || '',
      type: parts[i + 2] || 'file'
    });
  }
}

setValue("courseMaterials", materialsArray, { shouldValidate: false });
```

---

### **5. Course Registration Page - Save Materials**

**Convert to triplets when saving course:**
```typescript
// Convert to triplet format: name1,url1,type1,name2,url2,type2
const materialsString = data.courseMaterials
  .filter(m => m && m.url && m.url.length > 0)
  .map(material => `${material.name || 'material'},${material.url},${material.type || 'file'}`)
  .join(',');

data.courseMaterials = materialsString;
```

---

## **Files Modified**

1. ✅ **lib/action/courseMaterials.ts**
   - `getCourseMaterials()` - Parse triplets
   - `addCourseMaterials()` - Save triplets

2. ✅ **actions/manager/course-materials.ts**
   - `deleteCourseMaterial()` - Remove from triplets

3. ✅ **app/[lang]/@manager/course/registration/[[...id]]/page.tsx**
   - Load materials - Parse triplets from DB
   - Save materials - Convert to triplets for DB

---

## **Benefits of Multi-Data Format**

1. **✅ Complete Information**: Stores name, URL, and type
2. **✅ Better UX**: Display proper filenames instead of URLs
3. **✅ Type Awareness**: Know file type without parsing URL
4. **✅ Flexibility**: Can customize names independent of URL
5. **✅ Consistency**: Same format everywhere

---

## **Data Flow**

```
Database (String)
    "Document.pdf,/api/files/materials/123.pdf,pdf"
            ↓ (Parse triplets)
In-Memory (Array)
    [{name: "Document.pdf", url: "/api/files/materials/123.pdf", type: "pdf"}]
            ↓ (Form/Display)
User Interface
    📄 Document.pdf (PDF)
            ↓ (Save)
In-Memory (Array)
    [{name: "Document.pdf", url: "/api/files/materials/123.pdf", type: "pdf"}]
            ↓ (Convert to triplets)
Database (String)
    "Document.pdf,/api/files/materials/123.pdf,pdf"
```

---

## **Supported File Types**

- **pdf** - PDF documents
- **document** - Word documents (.doc, .docx)
- **presentation** - PowerPoint (.ppt, .pptx)
- **spreadsheet** - Excel (.xls, .xlsx)
- **video** - Video files (.mp4, .avi, .mov, .webm)
- **image** - Images (.jpg, .jpeg, .png, .gif, .webp)
- **archive** - Compressed files (.zip, .rar, .7z)
- **text** - Text files (.txt)
- **file** - Default/unknown types

---

## **Example Usage**

### **Adding Materials**:
```typescript
await addCourseMaterials(courseId, [
  { name: "Lecture 1", url: "/api/files/materials/123.pdf", type: "pdf" },
  { name: "Slides", url: "/api/files/materials/456.pptx", type: "presentation" }
]);

// Database: "Lecture 1,/api/files/materials/123.pdf,pdf,Slides,/api/files/materials/456.pptx,presentation"
```

### **Getting Materials**:
```typescript
const materials = await getCourseMaterials(courseId);
// Returns: [
//   { name: "Lecture 1", url: "/api/files/materials/123.pdf", type: "pdf" },
//   { name: "Slides", url: "/api/files/materials/456.pptx", type: "presentation" }
// ]
```

### **Deleting Materials**:
```typescript
await deleteCourseMaterial(courseId, "123.pdf");
// Database: "Slides,/api/files/materials/456.pptx,presentation"
```

---

**Date**: October 14, 2025  
**Status**: ✅ All Functions Updated to Multi-Data Format  
**Format**: `name,url,type` triplets (comma-separated)

