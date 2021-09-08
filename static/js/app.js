console.log(data);
let samples = data.samples;

for (let i = 0; i < 1; i++) {
    let id = samples[i].id;
    // Horizontal bar chart
    let sample_values = [];
    let otu_ids = [];
    let otu_labels = [];

    // Arrays of first 10 otu_ids, sample_values, and otu_labels
    for (let j = 0; j < 10; j++) {
        sample_values.push(samples[i].sample_values[j]);
        otu_ids.push(`OTU ${samples[i].otu_ids[j]}`);
        otu_labels.push(samples[i].otu_labels[j]);
    };

    // Plot the bar chart sorted descending by sample_values
    let barTrace = [{
        x: sample_values.reverse(),
        y: otu_ids.reverse(),
        text: otu_labels.reverse(),
        type: "bar",
        orientation: "h"
    }];

    let barLayout = {
        title: {text: `ID ${id}: Top 10 OTUs`}
    };

    Plotly.newPlot("bar", barTrace, barLayout);

};

