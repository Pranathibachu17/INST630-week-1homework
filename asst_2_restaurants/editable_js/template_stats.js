/**
 * STATS VIEW
 * Show aggregate statistics and insights - good for understanding the big picture
 */
function cleanValue(value) {
  if (!value || value === "------") {
    return "Not listed";
  }

  return value;
}

function showStats(data) {
  const totalRecords = data.length;
  const cities = [...new Set(data.map((item) => cleanValue(item.properties?.city)))];
  const nonCompliantCount = data.filter((item) => {
    const result = cleanValue(item.properties?.inspection_results);
    return result.includes("Non-Compliant");
  }).length;
  const criticalCount = data.filter((item) => {
    const result = cleanValue(item.properties?.inspection_results);
    return result.includes("Critical");
  }).length;
  const handWashingIssues = data.filter((item) => {
    return cleanValue(item.properties?.proper_hand_washing) === "Out of Compliance";
  }).length;
  const handWashingPercent = ((handWashingIssues / totalRecords) * 100).toFixed(1);

  const cityCounts = data.reduce((result, item) => {
    const city = cleanValue(item.properties?.city);
    result[city] = (result[city] || 0) + 1;
    return result;
  }, {});

  const resultCounts = data.reduce((result, item) => {
    const inspectionResult = cleanValue(item.properties?.inspection_results);
    result[inspectionResult] = (result[inspectionResult] || 0) + 1;
    return result;
  }, {});

  const typeCounts = data.reduce((result, item) => {
    const inspectionType = cleanValue(item.properties?.inspection_type);
    result[inspectionType] = (result[inspectionType] || 0) + 1;
    return result;
  }, {});

  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];
  const topResult = Object.entries(resultCounts).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  return `
    <h2 class="view-title">Stats View</h2>
    <p class="view-description">This dashboard highlights the main patterns from the full restaurant inspection dataset.</p>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Records</div>
        <div class="stat-number">${totalRecords}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cities</div>
        <div class="stat-number">${cities.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Non-Compliant</div>
        <div class="stat-number">${nonCompliantCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Critical Violations</div>
        <div class="stat-number">${criticalCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Hand-Washing Issues</div>
        <div class="stat-number">${handWashingPercent}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Top City</div>
        <div class="stat-number">${topCity ? topCity[0] : "Not listed"}</div>
      </div>
    </div>

    <div class="insight-box">
      <p><strong>Most common result:</strong> ${topResult ? topResult[0] : "Not listed"}</p>
      <p><strong>Most common inspection type:</strong> ${topType ? topType[0] : "Not listed"}</p>
    </div>
  `;
}

export default showStats;

