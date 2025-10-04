# Course Materials Migration Guide

## Overview

This migration changes the `courseMaterials` field from `String[]` (array) to `String` (comma-separated) to work with MySQL database.

## Changes Made

### 1. Prisma Schema (`prisma/schema.prisma`)

```prisma
// Before
courseMaterials String[]        @default([])

// After
courseMaterials String           @default("")
```

### 2. Data Access Functions (`lib/action/courseMaterials.ts`)

#### `addCourseMaterials` function:

- **Before**: Stored as JSON string array using `{ set: serialized }`
- **After**: Stores as comma-separated string format: `"name1,url1,type1,name2,url2,type2"`

#### `getCourseMaterials` function:

- **Before**: Parsed JSON strings from array
- **After**: Parses comma-separated string into array format for UI consumption

### 3. Course Registration (`lib/action/course.ts`)

- Updated serialization logic to use comma-separated format
- Removed `{ set: ... }` syntax for array operations
- Direct string assignment for both create and update operations

### 4. Database Migration

Created `migration_course_materials.sql` with the following steps:

1. Add temporary column
2. Convert existing array data to comma-separated string
3. Drop original column
4. Rename temporary column
5. Set default value

## Data Format

### Storage Format (Database)

```
"material1.pdf,/path/to/material1.pdf,pdf,material2.docx,/path/to/material2.docx,docx"
```

### UI Format (Application)

```javascript
[
  { name: "material1.pdf", url: "/path/to/material1.pdf", type: "pdf" },
  { name: "material2.docx", url: "/path/to/material2.docx", type: "docx" },
];
```

## Migration Steps

### 1. Run Database Migration

```sql
-- Execute the contents of migration_course_materials.sql
-- This will convert existing data from array format to comma-separated string
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Test the Application

- Verify course materials can be added
- Verify course materials can be retrieved and displayed
- Test both create and update operations

## Backward Compatibility

The migration maintains backward compatibility by:

1. Converting existing array data to comma-separated format
2. UI components continue to work with array format
3. Data access functions handle the conversion transparently

## Files Modified

1. `prisma/schema.prisma` - Schema definition
2. `lib/action/courseMaterials.ts` - Data access functions
3. `lib/action/course.ts` - Course registration logic
4. `migration_course_materials.sql` - Database migration script

## Testing Checklist

- [ ] Course materials can be added via UI
- [ ] Course materials are displayed correctly
- [ ] Existing course materials are preserved after migration
- [ ] Course creation with materials works
- [ ] Course update with materials works
- [ ] No data loss during migration

## Notes

- The comma-separated format is more MySQL-friendly
- UI components don't need changes as they work with array format
- Data conversion happens transparently in data access layer
- Migration script handles existing data conversion safely
