
const fs = require('fs');
const path = require('path');

try {
    const alertsPath = path.resolve('c:/Users/pratik/MRv5-TSX/MapRecruit.ai-TypeScript-/alerts.json');
    if (!fs.existsSync(alertsPath)) {
        console.log('alerts.json not found');
        process.exit(1);
    }

    let content = fs.readFileSync(alertsPath, 'utf8');
    // Strip BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    const alerts = JSON.parse(content);

    if (Array.isArray(alerts)) {
        console.log(`Total Alerts: ${alerts.length}`);
        alerts.forEach((alert, index) => {
            const rule = alert.rule ? alert.rule.id : 'Unknown Rule';
            const msg = alert.message ? alert.message.text || alert.message : 'No message';
            let loc = 'Unknown location';
            if (alert.most_recent_instance && alert.most_recent_instance.location) {
                loc = `${alert.most_recent_instance.location.path}:${alert.most_recent_instance.location.start_line}`;
            } else if (alert.location) {
                loc = `${alert.location.path}:${alert.location.start_line}`;
            }
            console.log(`[${index}] ${rule} - ${loc} - ${msg.substring(0, 100)}`);
        });
    } else {
        console.log('Not a standard array format. checking for SARIF');
        // Minimal SARIF check
        if (alerts.runs && Array.isArray(alerts.runs)) {
            console.log('Detected SARIF format');
            const results = alerts.runs[0].results;
            console.log(`SARIF Results Count: ${results.length}`);
            results.forEach((res, idx) => {
                const ruleId = res.ruleId;
                const message = res.message.text;
                // Location in SARIF can be deep
                let location = 'Unknown';
                let startLine = 0;
                if (res.locations && res.locations[0] && res.locations[0].physicalLocation) {
                    location = res.locations[0].physicalLocation.artifactLocation.uri;
                    if (res.locations[0].physicalLocation.region) {
                        startLine = res.locations[0].physicalLocation.region.startLine;
                    }
                }
                console.log(`[${idx}] ${ruleId} at ${location}:${startLine} - ${message.substring(0, 100)}`);
            });
        } else {
            console.log('Unknown format keys: ' + Object.keys(alerts).join(', '));
        }
    }

} catch (e) {
    console.error('Error parsing alerts:', e);
}
