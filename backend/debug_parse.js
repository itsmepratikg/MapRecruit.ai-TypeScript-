const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '..', 'SchemaData', 'Interviews');
const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} files.`);

for (const file of files) {
    const rawContent = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    const sanitizedContent = rawContent
        .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]+)"\)/g, '"$1"')
        .replace(/NumberLong\((\d+)\)/g, '$1')
        .replace(/NumberInt\((\d+)\)/g, '$1');

    try {
        const json = JSON.parse(sanitizedContent);
        console.log(`FILE: ${file} | _id: ${json._id}`);
    } catch (e) {
        console.error(`ERROR: ${file} | ${e.message}`);
    }
}
console.log('Finished.');
