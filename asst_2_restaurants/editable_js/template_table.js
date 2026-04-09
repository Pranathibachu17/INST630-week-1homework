
/**
 * TABLE VIEW
 * Display data in sortable rows - good for scanning specific information
 */
function cleanValue(value) {
  if (!value || value === "------") {
    return "Not listed";
  }

  return value;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Not listed";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function showTable(data) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.properties?.inspection_date || 0).getTime();
    const dateB = new Date(b.properties?.inspection_date || 0).getTime();
    return dateB - dateA;
  });

  const rows = sortedData
    .map((item) => {
      const restaurant = item.properties || {};

      return `
        <tr>
          <td>${cleanValue(restaurant.name)}</td>
          <td>${cleanValue(restaurant.city)}</td>
          <td>${formatDate(restaurant.inspection_date)}</td>
          <td>${cleanValue(restaurant.inspection_results)}</td>
          <td>${cleanValue(restaurant.inspection_type)}</td>
          <td>${cleanValue(restaurant.owner)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <h2 class="view-title">Table View</h2>
    <p class="view-description">Use this view to scan individual records and compare the most important restaurant details.</p>
    <div class="table-wrapper">
      <table class="restaurant-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Inspection Date</th>
            <th>Result</th>
            <th>Inspection Type</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

export default showTable;
