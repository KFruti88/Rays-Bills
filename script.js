<script>
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrB-ETsmpGrefh9bQ-g2qy3BC6OyAKGFXHLwerPD_t4iBulrGz5gzaPCzEswBbKoCLuk24YRcDz5T_/pub?output=csv';

    async function update() {
        try {
            const response = await fetch(csvUrl);
            const data = await response.text();
            const rows = data.split('\n').map(r => r.split(','));

            // FIND THE INCOME ROW DYNAMICALLY
            const payRow = rows.find(r => r[0] && r[0].toLowerCase().trim() === 'pay');
            
            // TARGET COLUMN C (Index 2)
            const c2Value = (payRow && payRow[2]) ? payRow[2].replace(/"/g, '').trim() : "$0.00";
            
            // UPDATE THE BIG DISPLAY
            document.getElementById('target-c2').innerText = c2Value;

            // LIST BILLS (Looking for specific labels in rows 4-12 range)
            const list = document.getElementById('bill-list');
            list.innerHTML = '';
            
            const billLabels = ['rent', 'storage', 'auto in', 'phone', 'fuel', 'verizon', 't-mobile'];
            
            rows.forEach(row => {
                const label = (row[0] || "").toLowerCase().trim();
                const amt = (row[1] || "").trim();
                
                if (billLabels.includes(label) && amt && amt !== "0" && amt !== "$0.00") {
                    list.innerHTML += `
                        <div class="bill-card">
                            <span class="bill-name" style="text-transform: capitalize;">${label}</span>
                            <span class="bill-val">-${amt.replace(/"/g, '')}</span>
                        </div>`;
                }
            });
        } catch (e) {
            document.getElementById('target-c2').innerText = "OFFLINE";
        }
    }

    update();
</script>
