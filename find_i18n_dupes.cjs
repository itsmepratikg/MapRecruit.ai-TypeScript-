const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\pratik\\MRv5-TSX\\MapRecruit.ai-TypeScript-\\src\\i18n.ts', 'utf8');

const regex = /translation: \{([\s\S]*?)\}/g;
let match;
let localeIdx = 0;
const locales = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'te-IN'];

while ((match = regex.exec(content)) !== null) {
    const section = match[1];
    const lines = section.split('\n');
    const seen = new Set();
    console.log(`--- Checking Locale: ${locales[localeIdx] || 'Unknown'} ---`);
    lines.forEach((line, i) => {
        const keyMatch = line.match(/"([^"]+)":/);
        if (keyMatch) {
            const key = keyMatch[1];
            if (seen.has(key)) {
                console.log(`Duplicate found: "${key}" at segment line ${i}`);
            }
            seen.add(key);
        }
    });
    localeIdx++;
}
