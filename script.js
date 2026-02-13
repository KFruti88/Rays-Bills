const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrB-ETsmpGrefh9bQ-g2qy3BC6OyAKGFXHLwerPD_t4iBulrGz5gzaPCzEswBbKoCLuk24YRcDz5T_/pub?gid=0&single=true&output=csv';

async function updateDashboard() {
    try {
        const response = await fetch(csvUrl, { cache: "no-store" });
        const text = await response.text();
        
        // 1. SPLIT ROWS (Handle Windows or Mac line endings)
        const rows = text.split(/\r?\n/);

        // 2. THE MONEY FIX: 
        // We use this specific Regex to split by comma ONLY if it's NOT inside quotes.
        // This keeps "$1,611.31" as ONE item, instead of splitting it into "$1" and "611.31"
        const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

        // Flatten all rows into one long chain of text
        let allData = [];
        rows.forEach(row => {
            // Split the row using the Money-Smart regex
            const parts = row.split(csvRegex).map(val => {
                // Remove the quotes Google puts around money ("$1,611.31" -> $1,611.31)
                return val.replace(/^"|"$/g, '').trim(); 
            });
            allData = allData.concat(parts);
        });

        // 3. FIND THE MONEY
        for (let i = 0; i < allData.length; i++) {
            const label = allData[i].toLowerCase();
            const value = allData[i+1]; // The item directly to the right

            // Check if we have a value to show
            if (!value) continue;

            // PAY
            if (label === 'pay') {
                document.getElementById('val-income').innerText = value;
            }

            // TOTAL LEFT
            if (label.includes('total left')) {
                document.getElementById('val-left').innerText = value;
                document.getElementById('val-spend').innerText = value;
            }

            // MOBILE GAMES
            if (label.includes('mobile games')) {
                document.getElementById('val-games').innerText = value;
            }
        }

    } catch (e) {
        console.error("Sync Error: " + e.message);
    }
}

updateDashboard();
setInterval(updateDashboard, 15000);
