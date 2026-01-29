const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..', 'SchemaData', 'Interviews');
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

const schemaMap = {};

function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'Array';
    if (typeof value === 'object') {
        if (value.hasOwnProperty('$oid')) return 'ObjectId';
        if (value.hasOwnProperty('$date')) return 'ISODate';
        // Handle the string representation of ObjectId and ISODate if they appear as functions in the JSON
        // Note: The files viewed earlier showed ObjectId(...) and ISODate(...) which is not valid JSON.
        // I need to handle how they are parsed.
        return 'Object';
    }
    return typeof value;
}

function analyzeObject(obj, currentPath = '') {
    for (const key in obj) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        const value = obj[key];
        const type = getType(value);

        if (!schemaMap[fullPath]) {
            schemaMap[fullPath] = new Set();
        }
        schemaMap[fullPath].add(type);

        if (type === 'Object') {
            analyzeObject(value, fullPath);
        } else if (type === 'Array' && value.length > 0) {
            // Sample first element for array type if it's an object
            const firstElemType = getType(value[0]);
            const arrayPath = `${fullPath}[]`;
            if (!schemaMap[arrayPath]) {
                schemaMap[arrayPath] = new Set();
            }
            schemaMap[arrayPath].add(firstElemType);
            if (firstElemType === 'Object') {
                analyzeObject(value[0], arrayPath);
            }
        }
    }
}

// Since the JSON files seen earlier are actually MongoDB Dumps (containing ObjectId and ISODate functions),
// a standard JSON.parse will fail. I need to "clean" or mock those functions.

files.forEach(file => {
    let content = fs.readFileSync(path.join(directoryPath, file), 'utf8');

    // Simple regex to replace MongoDB specific types for parsing
    // Replaces ObjectId("...") with { "$oid": "..." }
    content = content.replace(/ObjectId\("(.*?)"\)/g, '"$1"');
    // Replaces ISODate("...") with "..."
    content = content.replace(/ISODate\("(.*?)"\)/g, '"$1"');

    try {
        const data = JSON.parse(content);
        analyzeObject(data);
    } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
    }
});

const report = Object.keys(schemaMap).sort().map(path => {
    return {
        path,
        types: Array.from(schemaMap[path])
    };
});

console.log(JSON.stringify(report, null, 2));
