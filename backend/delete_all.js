const fs = require('fs');
const path = require('path');

const JSON_DB_DIR = path.join(__dirname, 'json_db');

function clearEverything() {
    console.log('🧹 Clearing all accounts and records...');

    // 1. Clear JSON Database
    if (fs.existsSync(JSON_DB_DIR)) {
        const files = fs.readdirSync(JSON_DB_DIR);
        for (const file of files) {
            fs.unlinkSync(path.join(JSON_DB_DIR, file));
            console.log(`Deleted: ${file}`);
        }
        console.log('✅ Local JSON Database cleared.');
    }

    console.log('\n🚀 SYSTEM READY FOR NEW REGISTRATIONS.');
    console.log('Note: If your Cloud Database comes back online, it will still contain old data unless you run the cloud reset script.');
}

clearEverything();
