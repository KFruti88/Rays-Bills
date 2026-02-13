const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrB-ETsmpGrefh9bQ-g2qy3BC6OyAKGFXHLwerPD_t4iBulrGz5gzaPCzEswBbKoCLuk24YRcDz5T_/pub?gid=0&single=true&output=csv';

async function update() {
    try {
        const response = await fetch(csvUrl, { cache: "no-store" });
        const data = await response.text();
        const rows = data.split(/\r?\n/).map(r => r.split(',').map(c => c.replace(/"/g, '').trim()));

        rows.forEach(row => {
            if (row.length < 2) return;

            const label = row[0].toLowerCase();
            const value = row[1]; // Value is in Column B

            // ROW 1: PAY (Top Box)
            if (label === 'pay') {
                const incomeEl = document.getElementById('val-income');
                if (incomeEl) incomeEl.innerText = value;
            }

            // ROW 2: TOTAL LEFT / SPEND (Middle Row)
            if (label.includes('total left')) {
                const leftEl = document.getElementById('val-left');
                const spendEl = document.getElementById('val-spend');
                if (leftEl) leftEl.innerText = value;
                if (spendEl) spendEl.innerText = value;
            }

            // ROW 3: MOBILE GAMES (Bottom Alert)
            if (label.includes('mobile games')) {
                const gamesEl = document.getElementById('val-games');
                if (gamesEl) gamesEl.innerText = value;
            }
        });

    } catch (e) {
        console.error("Sync Error");
    }
}

update();
setInterval(update, 30000);
