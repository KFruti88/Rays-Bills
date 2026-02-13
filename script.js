<script>
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrB-ETsmpGrefh9bQ-g2qy3BC6OyAKGFXHLwerPD_t4iBulrGz5gzaPCzEswBbKoCLuk24YRcDz5T_/pub?output=csv';

    async function update() {
        try {
            const response = await fetch(csvUrl, { cache: "no-cache" });
            const data = await response.text();
            
            // Clean the data: Split into rows and strip quotes/hidden line breaks
            const rows = data.split(/\r?\n/).map(r => r.split(',').map(c => c.replace(/"/g, '').trim()));

            // 1. DIRECT TARGET: Total Monthly Income (C2)
            // Coordination: Row Index 1, Column Index 2
            const incomeValue = rows[1][2];
            document.getElementById('income-target').innerText = incomeValue;

            // 2. SCAN FOR TEXT LABELS FOR THE REMAINING BOXES
            rows.forEach(row => {
                const label = row[0] ? row[0].toLowerCase() : "";

                // Target: Total Left from Bills ($384.87)
                if (label.includes("total left")) {
                    const val = row[1] || row[2];
                    document.getElementById('left-target').innerText = val;
                    document.getElementById('spend-target').innerText = val;
                }

                // Target: Mobile Games Price ($1,964.00)
                if (label.includes("mobile games")) {
                    document.getElementById('games-target').innerText = row[1] || row[2];
                }
            });

        } catch (e) {
            console.error("Fetch failed");
            document.getElementById('income-target').innerText = "OFFLINE";
        }
    }

    // Run the update
    update();

    // Auto-refresh every 30 seconds to stay synced with your sheet
    setInterval(update, 30000);
</script>
