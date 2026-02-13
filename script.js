const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrB-ETsmpGrefh9bQ-g2qy3BC6OyAKGFXHLwerPD_t4iBulrGz5gzaPCzEswBbKoCLuk24YRcDz5T_/pub?gid=0&single=true&output=csv';

async function updateDashboard() {
    try {
        const response = await fetch(csvUrl, { cache: "no-store" });
        const text = await response.text();
        
        // 1. SPLIT BY NEW LINE FIRST
        const lines = text.split(/\r?\n/);
        
        // 2. PARSE EACH LINE CORRECTLY (Respecting quotes around "$1,611.31")
        // This regex splits by comma ONLY if it's not inside quotes
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        
        // Flatten into one big list of values
        let allData = [];
        lines.forEach(line => {
            const parts = line.split(regex).map(c => c.replace(/"/g, '').trim());
            allData = allData.concat(parts);
        });

        // 3. SCAN THE CLEAN LIST
        for (let i = 0; i < allData.length; i++) {
            const label = allData[i].toLowerCase();
            const val = allData[i+1]; // The item directly next to it

            // PAY
            if (label === 'pay' && val) {
                document.getElementById('val-income').innerText = val;
            }

            // TOTAL LEFT
            if (label.includes('total left') && val) {
                document.getElementById('val-left').innerText = val;
                document.getElementById('val-spend').innerText = val;
            }

            // MOBILE GAMES
            if (label.includes('mobile games') && val) {
                document.getElementById('val-games').innerText = val;
            }
        }

    } catch (e) {
        console.error("Sync Error");
    }
}

updateDashboard();
setInterval(updateDashboard, 15000);
