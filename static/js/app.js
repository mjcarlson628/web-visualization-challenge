console.log(data);
let samples = data.samples;
let id = 940;

function init() {
// x = sample_values, y = otu_ids for id 940 initially
    let sampleInit = data.samples[0].sample_values;
    let otuidInit = data.samples[0].otu_ids;
    let initLabels = [];
    for (let i = 0; i < 10; i++) {
        initLabels.push(`OTU ${data.samples[0].otu_ids[i]}`);
    };


    let initBar = [{
        x: sampleInit.slice(0, 10).reverse(),
        y: initLabels.reverse(),
        text: data.samples[0].otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];

    let initBubble = [{
        x: otuidInit,
        y: sampleInit,
        mode: "markers",
        opacity: 0.75,
        marker: {
            color: otuidInit,
            size: sampleInit.map(item => item * 25),
            sizemode: "area"
        },
    }];

    let bubbleLayout = {
        xaxis: {
            title: {text: "OTU ID"}
        }
    };

    Plotly.newPlot("bar", initBar);
    Plotly.newPlot("bubble", initBubble, bubbleLayout);
};

// Dropdown menu to select ID number
let dropdownMenu = d3.select("select");
for (let m = 0; m < data.names.length; m++) {
    dropdownMenu.append("option").text(data.names[m]);
};

d3.selectAll("#selDataset").on("click", optionChanged);

function optionChanged() {
    let id = this.value;
    let sampleValues = [];
    let otuIds = [];
    let otuBars = [];
    let otuLabels = [];

    console.log(id);

// Horizontal bar chart
// Match metadata id with samples id
    for (let i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].id==id) {
            // console.log(data.metadata[i].age);
            for (let j = 0; j < data.samples.length; j++) {
                if (data.samples[j].id==id) {
                    // console.log(data.samples[i].otu_ids[0]);
// Arrays of first 10 otu_ids, sample_values, and otu_labels
                    for (let k = 0; k < 10; k++) {
                        sampleValues.push(data.samples[j].sample_values[k]);
                        otuIds.push(data.samples[j].otu_ids[k]);
                        otuBars.push(`OTU ${data.samples[j].otu_ids[k]}`);
                        otuLabels.push(data.samples[j].otu_labels[k]);
                    };
// Bubble Chart
                    let bubbleTrace = [{
                        x: otuIds,
                        y: sampleValues,
                        text: otuLabels,
                        mode: "markers",
                        marker: {
                            // color: ,
                            size: Math.sqrt(sampleValues) * 2
                        }
                    }];
                };
            };
            console.log(sampleValues);
// Plot the bar chart sorted descending by sample_values
            Plotly.restyle("bar", "x", [sampleValues.reverse()]);
            Plotly.restyle("bar", "y", [otuBars.reverse()]);
            Plotly.restyle("bar", "text", [otuLabels.reverse()]);
// Restyle bubble chart
            Plotly.restyle("bubble", "x", [otuIds.reverse()]);
            Plotly.restyle("bubble", "y", [sampleValues.reverse]);
            Plotly.restyle("bubble", "color", [otuIds.reverse]);
            };

        };

    };


init();