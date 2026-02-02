
const fs = require('fs');
const path = require('path');

try {
  const alertsPath = path.resolve('c:/Users/pratik/MRv5-TSX/MapRecruit.ai-TypeScript-/alerts.json');
  if (!fs.existsSync(alertsPath)) {
    console.log('alerts.json not found');
    process.exit(1);
  }

  const content = fs.readFileSync(alertsPath, 'utf8');
  const alerts = JSON.parse(content);

  console.log(`Total Alerts: ${alerts.length}`);
  
  // Print summary of alerts
  alerts.forEach((alert, index) => {
    // Attempt to extract relevant info based on standard CodeQL SARIF or generic JSON format
    // Adjust logic if format is different
    // Assuming a flat array of objects for now based on typical exports, but SARIF is deeper.
    // Let's inspect the first one to be sure, or print a summary.
    
    // If it's SARIF, the structure is runs[0].results
    if (alerts.runs && Array.isArray(alerts.runs)) {
       console.log('Detected SARIF format');
       const results = alerts.runs[0].results;
       console.log(`SARIF Results Count: ${results.length}`);
       results.forEach((res, idx) => {
          const ruleId = res.ruleId;
          const message = res.message.text;
          const location = res.locations[0].physicalLocation.artifactLocation.uri;
          const startLine = res.locations[0].physicalLocation.region.startLine;
          console.log(`[${idx}] ${ruleId} at ${location}:${startLine} - ${message}`);
       });
    } else if (Array.isArray(alerts)) {
        // Assume simple array
        const rule = alert.rule ? alert.rule.id : 'Unknown Rule';
        const msg = alert.message ? alert.message.text || alert.message : 'No message';
        // Try to find location
        let loc = 'Unknown location';
        if (alert.location) loc = `${alert.location.path || alert.location.file}:${alert.location.start_line || alert.location.startLine}`;
        else if (alert.most_recent_instance && alert.most_recent_instance.location) {
             loc = `${alert.most_recent_instance.location.path}:${alert.most_recent_instance.location.start_line}`;
        }
        
        console.log(`[${index}] ${alert.number || index} - ${alert.rule ? alert.rule.description || alert.rule.id : rule} - ${loc}`);
    } else {
        console.log('Unknown JSON structure');
        console.log(JSON.stringify(alerts).substring(0, 500));
    }
  });

} catch (e) {
  console.error('Error parsing alerts:', e);
}
