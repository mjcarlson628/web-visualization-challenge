console.log(data);
let samples = data.samples;
let metadata = data.metadata;
let id = 940;

function init() {
// x = sample_values, y = otu_ids for id 940 initially
    let sampleInit = data.samples[0].sample_values;
    let otuidInit = data.samples[0].otu_ids;
    let initLabels = [];
    for (let i = 0; i < 10; i++) {
        initLabels.push(`OTU ${data.samples[0].otu_ids[i]}`);
    };
// Initial bar chart of top 10 otu ids
    let initBar = [{
        x: sampleInit.slice(0, 10).reverse(),
        y: initLabels.reverse(),
        text: data.samples[0].otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
// Initial bubble chart
    let initBubble = [{
        x: otuidInit,
        y: sampleInit,
        mode: "markers",
        opacity: 0.75,
        marker: {
            color: otuidInit,
            colorscale: 'Jet',
            size: sampleInit.map(item => item * 25),
            sizemode: "area"
        },
    }];
    let bubbleLayout = {
        xaxis: {
            title: {text: "OTU ID"}
        }
    };
// Dropdown menu to select id number
    let dropdownMenu = d3.select("select");
    for (let m = 0; m < data.names.length; m++) {
        dropdownMenu.append("option").text(data.names[m]);
    };
// Demographic info
    let demographic = d3.select(".panel-body");
    for (let d = 0; d < Object.keys(metadata[0]).length; d++) {
        demographic.append("p").text(`${Object.keys(metadata[0])[d]}: ${Object.values(metadata[0])[d]}`)
    };

// Create the charts
    Plotly.newPlot("bar", initBar);
    Plotly.newPlot("bubble", initBubble, bubbleLayout);
};

// Restyle charts for new id by clicking a dropdown option
d3.selectAll("#selDataset").on("click", optionChanged);

function optionChanged() {
    let id = this.value;
    let sampleValues = [];
    let otuIds = [];
    let otuBars = [];
    let otuLabels = [];
    let newDemographic = [];
// Demographic info for new id
    for (let i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].id==id) {
            let demographic = d3.selectAll(".panel-body");
            demographic.text("");
            for (let d = 0; d < Object.keys(metadata[i]).length; d++) {
                demographic.append("p").text(`${Object.keys(metadata[i])[d]}: ${Object.values(metadata[i])[d]}`)
            };
// Match metadata id with samples id
            for (let j = 0; j < data.samples.length; j++) {
                if (data.samples[j].id==id) {
// Horizontal bar chart
// Arrays of otu_ids, sample_values, and otu_labels
                    for (let k = 0; k < samples[j].sample_values.length; k++) {
                        sampleValues.push(data.samples[j].sample_values[k]);
                        otuIds.push(data.samples[j].otu_ids[k]);
                        otuBars.push(`OTU ${data.samples[j].otu_ids[k]}`);
                        otuLabels.push(data.samples[j].otu_labels[k]);
                    };
                    console.log(sampleValues);
// Plot the bar chart of top 10 otus sorted descending by sample_values
                    Plotly.restyle("bar", "x", [sampleValues.slice(0, 10).reverse()]);
                    Plotly.restyle("bar", "y", [otuBars.slice(0, 10).reverse()]);
                    Plotly.restyle("bar", "text", [otuLabels.slice(0, 10).reverse()]);
// Restyle bubble chart to match new id number
                    Plotly.restyle("bubble", "x", [data.samples[j].otu_ids]);
                    Plotly.restyle("bubble", "y", [data.samples[j].sample_values]);
                    Plotly.restyle("bubble", "marker.size", [data.samples[j].sample_values.map(item => item * 25)]);
                    Plotly.restyle("bubble", "marker.color", [data.samples[j].otu_ids]);
                };
            };
        };
    };
};


init();