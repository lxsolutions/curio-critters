


import { readFileSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const ajv = new Ajv();

// Load schema
const schemaPath = join(fileURLToPath(import.meta.url), '../../schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

// Load curriculum data
const dataPath = join(fileURLToPath(import.meta.url), '../../data/k3-math.yaml');
const yamlData = readFileSync(dataPath, 'utf8');
const curriculumData = yaml.parse(yamlData) as {
  items: Array<{ id: string; type: string; a?: number[]; b?: number[] }>;
  grade_band: string;
  domain: string;
};

// Validate against schema
const validate = ajv.compile(schema);
const valid = validate(curriculumData);

if (!valid) {
  console.error('❌ Curriculum validation failed:');
  console.error(validate.errors);
  process.exit(1);
}

// Additional custom validation
const errors: string[] = [];

// Validate that all items have unique IDs
const itemIds = new Set();
curriculumData.items.forEach((item: any) => {
  if (itemIds.has(item.id)) {
    errors.push(`Duplicate item ID: ${item.id}`);
  }
  itemIds.add(item.id);
});

// Validate operation constraints
curriculumData.items.forEach((item: any) => {
  if (item.type === 'add') {
    // For addition, ensure a and b arrays are provided
    if (!item.a || !Array.isArray(item.a) || item.a.length === 0) {
      errors.push(`Item ${item.id}: Missing or invalid 'a' array for addition`);
    }
    if (!item.b || !Array.isArray(item.b) || item.b.length === 0) {
      errors.push(`Item ${item.id}: Missing or invalid 'b' array for addition`);
    }
  } else if (item.type === 'sub') {
    // For subtraction, ensure a and b arrays are provided
    if (!item.a || !Array.isArray(item.a) || item.a.length === 0) {
      errors.push(`Item ${item.id}: Missing or invalid 'a' array for subtraction`);
    }
    if (!item.b || !Array.isArray(item.b) || item.b.length === 0) {
      errors.push(`Item ${item.id}: Missing or invalid 'b' array for subtraction`);
    }
  }
});

if (errors.length > 0) {
  console.error('❌ Custom validation errors:');
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('✅ Curriculum validation passed!');
console.log(`📊 Found ${curriculumData.items.length} math items`);
console.log(`🎯 Grade band: ${curriculumData.grade_band}`);
console.log(`📚 Domain: ${curriculumData.domain}`);

