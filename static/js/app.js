function buildMetadata(sample) {
  d3.json('/metadata/${sample}').then((data) =>) {
    let selectManipulatePanel = d3.select("#sample-metadata");
    selectManipulatePanel.html("");
    Object.entries(data).forEach(([key, value]) => {
      selectManipulatePanel.qppend("h6").text('${key}:${value}');
    });
  };
};

function buildCharts(sample) {
  d3.json('/samples/${sample}').then((data) => {
    let otu_ids = data.otu_ids;
    let otu_labels = data.otu_labels;
    let sample_values = data.sample_values;

    let pieChartData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        colorscale: "Picnic",
        type: "pie"
      }
    ];

    let pieChartLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieChartData, pieChartLayout);

    let bubbleChartData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          sample_values,
          color: otu_ids,
          colorscale: "Picnic"
        }
      }
    ];

    let bubbleChartLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "otu id" }
    };

    Plotly.plot("bubble", bubbleChartData, bubbleChartLayout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
