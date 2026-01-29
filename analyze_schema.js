
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'SchemaData', 'campaigns');

function cleanJSON(content) {
    // aggressive cleaning
    let cleaned = content
        .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]+)"\)/g, '"$1"')
        .replace(/NumberInt\(([^)]+)\)/g, '$1')
        .replace(/NumberLong\(([^)]+)\)/g, '$1');
    return cleaned;
}

function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function traverse(obj, path = '', keys = new Set()) {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    if (Array.isArray(obj)) {
        if (obj.length > 0) {
            if (typeof obj[0] === 'object') {
                traverse(obj[0], path + '[]', keys);
            } else {
                // generic array of primitives
                keys.add(`${path}[] (${getType(obj[0])})`);
            }
        } else {
            // Empty array, we don't know the type, but record it exists
            keys.add(`${path}[] (unknown)`);
        }
        return;
    }

    Object.keys(obj).forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        const type = getType(obj[key]);
        keys.add(`${currentPath} (${type})`);

        if (type === 'object') {
            traverse(obj[key], currentPath, keys);
        }
    });
}

try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const allKeys = new Map(); // Key -> { types: Set, validIn: count }

    console.log(`Scanning ${files.length} files in ${dir}...`);

    files.forEach(file => {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const cleanContent = cleanJSON(content);

        try {
            const data = JSON.parse(cleanContent);

            const fileKeys = new Set();
            traverse(data, '', fileKeys);

            fileKeys.forEach(k => {
                const [keyPath, typeFull] = k.split(' (');
                const cleanType = typeFull ? typeFull.replace(')', '') : 'unknown';

                if (!allKeys.has(keyPath)) {
                    allKeys.set(keyPath, { types: new Set(), count: 0 });
                }
                const entry = allKeys.get(keyPath);
                entry.types.add(cleanType);
                entry.count++;
            });

        } catch (e) {
            console.error(`FAILED to parse ${file}: ${e.message}`);
            // Print a snippet to see what broke it
            const lines = cleanContent.split('\n');
            // Try to find the line? JSON.parse usually gives a position
            const match = e.message.match(/position (\d+)/);
            if (match) {
                const pos = parseInt(match[1]);
                console.log('Context:', cleanContent.substring(Math.max(0, pos - 50), Math.min(cleanContent.length, pos + 50)));
            }
        }
    });

    console.log('\n--- Schema Analysis Report ---');
    console.log(`Analyzed ${files.length} files.`);

    const sortedKeys = Array.from(allKeys.keys()).sort();

    sortedKeys.forEach(key => {
        const info = allKeys.get(key);
        // Only print if it's significant or requested by user (user asked to check ALL)
        // I'll print everything for now but condensed

        const typesStr = Array.from(info.types).join('/');
        const optional = info.count < files.length ? '(OPTIONAL)' : '(REQUIRED)';
        console.log(`- [${optional}] ${key}: ${typesStr} (${info.count}/${files.length} files)`);
    });

} catch (err) {
    console.error('Fatal Script Error:', err);
}
