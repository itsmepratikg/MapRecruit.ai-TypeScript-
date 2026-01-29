
const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\pratik\\MRv5-TSX\\MapRecruit.ai-TypeScript-\\SchemaData\\campaigns';

function cleanAndParse(content) {
    // Replace BSON types with strings or numbers to make it valid JSON
    let cleaned = content
        .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]+)"\)/g, '"$1"')
        .replace(/NumberInt\(([^)]+)\)/g, '$1')
        .replace(/NumberLong\(([^)]+)\)/g, '$1');
    return JSON.parse(cleaned);
}

function getStructure(obj, prefix = '') {
    let keys = [];
    if (!obj || typeof obj !== 'object') return keys;

    if (Array.isArray(obj)) {
        if (obj.length > 0 && typeof obj[0] === 'object') {
            keys = keys.concat(getStructure(obj[0], prefix + '[]'));
        } else {
            keys.push(prefix + '[]');
        }
    } else {
        Object.keys(obj).forEach(k => {
            const nextPrefix = prefix ? prefix + '.' + k : k;
            keys.push(nextPrefix);
            if (obj[k] && typeof obj[k] === 'object') {
                keys = keys.concat(getStructure(obj[k], nextPrefix));
            }
        });
    }
    return keys;
}

try {
    if (!fs.existsSync(DIR)) {
        console.log('Directory not found: ' + DIR);
        process.exit(0);
    }

    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
    console.log('Files found: ' + files.length);

    const keyMap = {};

    files.forEach(f => {
        try {
            const content = fs.readFileSync(path.join(DIR, f), 'utf8');
            const data = cleanAndParse(content);
            const structure = getStructure(data);
            const uniqueKeys = new Set(structure);

            uniqueKeys.forEach(k => {
                keyMap[k] = (keyMap[k] || 0) + 1;
            });
        } catch (e) {
            console.log('Error processing ' + f + ': ' + e.message);
        }
    });


    const reportPath = path.join(DIR, '..', '..', 'schema_analysis_report.md');
    const stream = fs.createWriteStream(reportPath);

    stream.write('# Campaign Schema Analysis\n\n');
    stream.write(`Analyzed ${files.length} files.\n\n`);

    Object.keys(keyMap).sort().forEach(k => {
        const count = keyMap[k];
        const status = count === files.length ? 'REQUIRED' : 'OPTIONAL';
        stream.write(`- \`${k}\`: ${count}/${files.length} **${status}**\n`);
    });

    stream.end();
    console.log('Report written to ' + reportPath);

} catch (e) {
    console.log('Main Error: ' + e.message);
}
