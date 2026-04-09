/**
 * EXTERNAL LIBRARY VIEW
 * Pick an external library and pipe your data to it.
 */
// function showExternal(data) {
//   // Requirements:
//   // - Show data using an external library, such as leaflet.js or chartsjs or similar.
//   // - Make a filter on this page so your external library only shows useful data.

//   /* javascript goes here! you can return it below */


/**
 * EXTERNAL LIBRARY VIEW
 * Use Chart.js to visualize inspection results.
 */
function showExternal(data) {
  const validRecords = data.filter((item) => {
    const result = item.properties?.inspection_results;
    return result && result !== "------";
  });

  let higherRiskCount = 0;
  let otherResultsCount = 0;

  validRecords.forEach((item) => {
    const result = item.properties.inspection_results;

    if (
      result.includes("Non-Compliant") ||
      result.includes("Critical") ||
      result.includes("Closed") ||
      result.includes("Outstanding")
    ) {
      higherRiskCount++;
    } else {
      otherResultsCount++;
    }
  });

  setTimeout(() => {
    const chartCanvas = document.getElementById("myExternalChart");

    if (chartCanvas && window.Chart) {
      new window.Chart(chartCanvas, {
        type: "pie",
        data: {
          labels: ["Higher Risk Results", "Other Results"],
          datasets: [
            {
              data: [higherRiskCount, otherResultsCount],
              backgroundColor: ["#F44336", "#4CAF50"],
            },
          ],
        },
      });
    }
  }, 100);

  return `
    <h2 class="view-title">External Library View</h2>
    <p class="view-description">This view uses Chart.js to compare higher-risk inspection outcomes with all other results.</p>
    <div style="text-align: center;">
      <p><strong>Total Valid Inspections:</strong> ${validRecords.length}</p>
      <p><strong>Higher Risk Results:</strong> ${higherRiskCount}</p>
      <p><strong>Other Results:</strong> ${otherResultsCount}</p>
      <div style="height: 400px; width: 400px; margin: 20px auto;">
        <canvas id="myExternalChart"></canvas>
      </div>
    </div>
  `;
}

export default showExternal;
