let splitRows;

getData().then((splitRows) => {
    createChart(splitRows)
})

async function createChart(splitRows) {
    const crimes = [];
    const crimeCounts = [];

    splitRows.forEach(splitRow => {
        let crime = splitRow[3]
        crime = crime.replace(/"/g, ''); 
        
        if (crimes.indexOf(crime) == -1 && crime != "PD_DESC") {
            crimes.push(crime)
            crimeCounts.push(0)
        } else {
            crimeCounts[crimes.indexOf(crime)] += 1
        }
    })

    const crimeData = crimes.map((crime, index) => {
        return { crime: crime, count: crimeCounts[index] };
    });

    crimeData.sort((a, b) => b.count - a.count);
    const sortedCrimes = crimeData.map(item => item.crime);
    const sortedCrimeCounts = crimeData.map(item => item.count);

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: sortedCrimes.slice(0, 50),
            datasets: [{
                data: sortedCrimeCounts.slice(0, 50),
                borderWidth: 0,
                hoverOffset: 80,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: 40
            }
        }
    });
}

async function getData() {
    const response = await fetch("NYPD_Arrest_Data__Year_to_Date_.csv");
    const data = await response.text();
    const rows = data.split("\n");  

    let splitRows = [];
    rows.forEach(row => {
        splitRows.push(row.split(","));
    })
    return splitRows;
}