// console.log(data);
let samples = data.samples;
let metadata = data.metadata;
let id = 940;

function init() {
// x = sample_values, y = otu_ids for id 940 initially
    let sampleInit = samples[0].sample_values;
    let otuidInit = samples[0].otu_ids;
    let initLabels = [];
    for (let i = 0; i < 10; i++) {
        initLabels.push(`OTU ${samples[0].otu_ids[i]}`);
    };
// Initial bar chart of top 10 otu ids
    let initBar = [{
        x: sampleInit.slice(0, 10).reverse(),
        y: initLabels.reverse(),
        text: samples[0].otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    let barLayout = {
        title: {
            text: "<b>Top OTUs</b>",
            font: {size: 24}
        }
    };
// Initial bubble chart
    let initBubble = [{
        x: otuidInit,
        y: sampleInit,
        text: samples[0].otu_labels,
        opacity: 0.75,
        mode: "markers",
        marker: {
            color: otuidInit,
            colorscale: 'Jet',
            size: sampleInit.map(value => value/1.5)
        },
    }];
    let bubbleLayout = {
        xaxis: {
            title: {text: "OTU ID"}
        }
    };
// Dropdown menu to select id number
    let dropdownMenu = d3.select("#selDataset");
    for (let m = 0; m < data.names.length; m++) {
        dropdownMenu.append("option").text(data.names[m]);
    };
// Demographic info
    let demographic = d3.select("#sample-metadata");
    for (let d = 0; d < Object.keys(metadata[0]).length; d++) {
        demographic.append("p").html(`<b>${Object.keys(metadata[0])[d]}:</b> ${Object.values(metadata[0])[d]}`)
    };
// Weekly scrubs gauge
    let initGauge = [{
        type: "indicator",
        mode: "gauge+number",
        value: metadata[0].wfreq,
        gauge: {
            axis: {range: [null, 9]},
            bar: {color: "darkblue"},
            steps: [
                {range: [0, 1], color: "rgb(255, 0, 0)"},
                {range: [1, 2], color: "rgb(224, 32, 0)"},
                {range: [2, 3], color: "rgb(192, 64, 0)"},
                {range: [3, 4], color: "rgb(160, 96, 0)"},
                {range: [4, 5], color: "rgb(128, 128, 0)"},
                {range: [5, 6], color: "rgb(96, 160, 0)"},
                {range: [6, 7], color: "rgb(64, 192, 0)"},
                {range: [7, 8], color: "rgb(32, 224, 0)"},
                {range: [8, 9], color: "rgb(0, 255, 0)"}
            ]
        }
    }];
    let gaugeLayout = {
        title: {
            text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
            font: {size: 24}
        }
    };
// Create the charts
    Plotly.newPlot("bar", initBar, barLayout);
    Plotly.newPlot("bubble", initBubble, bubbleLayout);
    Plotly.newPlot("gauge", initGauge, gaugeLayout);
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
    for (let i = 0; i < metadata.length; i++) {
        if (metadata[i].id==id) {
            let demographic = d3.selectAll("#sample-metadata");
            demographic.html("");
            for (let d = 0; d < Object.keys(metadata[i]).length; d++) {
                demographic.append("p").html(`<b>${Object.keys(metadata[i])[d]}:</b> ${Object.values(metadata[i])[d]}`)
            };
// Match metadata id with samples id
            for (let j = 0; j < samples.length; j++) {
                if (samples[j].id==id) {
// Horizontal bar chart
// Arrays of otu_ids, sample_values, and otu_labels
                    for (let k = 0; k < samples[j].sample_values.length; k++) {
                        sampleValues.push(samples[j].sample_values[k]);
                        otuIds.push(samples[j].otu_ids[k]);
                        otuBars.push(`OTU ${samples[j].otu_ids[k]}`);
                        otuLabels.push(samples[j].otu_labels[k]);
                    };
// Plot the bar chart of top 10 otus sorted descending by sample_values
                    Plotly.restyle("bar", "x", [sampleValues.slice(0, 10).reverse()]);
                    Plotly.restyle("bar", "y", [otuBars.slice(0, 10).reverse()]);
                    Plotly.restyle("bar", "text", [otuLabels.slice(0, 10).reverse()]);
// Restyle bubble chart to match new id number
                    Plotly.restyle("bubble", "x", [samples[j].otu_ids]);
                    Plotly.restyle("bubble", "y", [samples[j].sample_values]);
                    Plotly.restyle("bubble", "text", [samples[j].otuLabels]);
                    Plotly.restyle("bubble", "marker.size", [samples[j].sample_values.map(value => value/1.5)]);
                    Plotly.restyle("bubble", "marker.color", [samples[j].otu_ids]);
// Update gauge
                    Plotly.restyle("gauge", "value", metadata[i].wfreq)
                };
            };
        };
    };
};

init();