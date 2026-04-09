/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function cleanValue(value) {
  if (!value || value === "------") {
    return "Not listed";
  }

  return value;
}

function showCategories(data) {
  const grouped = data.reduce((result, item) => {
    const city = cleanValue(item.properties?.city);

    if (!result[city]) {
      result[city] = [];
    }

    result[city].push(item);
    return result;
  }, {});

  const groups = Object.entries(grouped)
    .map(([city, items]) => {
      const nonCompliant = items.filter((item) => {
        const result = cleanValue(item.properties?.inspection_results);
        return result.includes("Non-Compliant") || result.includes("Critical");
      }).length;

      const examples = items
        .slice(0, 3)
        .map((item) => cleanValue(item.properties?.name));

      return {
        city,
        count: items.length,
        nonCompliant,
        examples,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return `
    <h2 class="view-title">Category View</h2>
    <p class="view-description">This view groups the restaurants by city so it is easier to compare places with the most inspection activity.</p>
    <div class="category-grid">
      ${groups
        .map(
          (group) => `
            <div class="category-card">
              <h3>${group.city}</h3>
              <p><strong>Records:</strong> ${group.count}</p>
              <p><strong>Non-compliant:</strong> ${group.nonCompliant}</p>
              <p><strong>Example restaurants:</strong></p>
              <ul>
                ${group.examples.map((name) => `<li>${name}</li>`).join("")}
              </ul>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export default showCategories;
