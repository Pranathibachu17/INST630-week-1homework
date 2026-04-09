import showCategories from "./editable_js/template_category.js";
import showStats from "./editable_js/template_stats.js";
import showTable from "./editable_js/template_table.js";
import showExternal from "./editable_js/template_external.js";
import loadData from "./editable_js/load_data.js";

function updateDisplay(content) {
  document.getElementById("data-display").innerHTML = content;
}

function updateButtonStates(activeView) {
  document.querySelectorAll(".view-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(`btn-${activeView}`).classList.add("active");
}

function showLoading() {
  updateDisplay('<div class="loading">Loading data from data.json...</div>');
}

function showError(message) {
  updateDisplay(`
    <div class="error">
      <h3>Error Loading Data</h3>
      <p>${message}</p>
      <button onclick="location.reload()">Try Again</button>
    </div>
  `);
}

function renderExternalView(data) {
  updateDisplay(showExternal(data));
  updateButtonStates("external");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showLoading();
    const data = await loadData();

    document.getElementById("btn-categories").onclick = () => {
      updateDisplay(showCategories(data));
      updateButtonStates("categories");
    };

    document.getElementById("btn-table").onclick = () => {
      updateDisplay(showTable(data));
      updateButtonStates("table");
    };

    document.getElementById("btn-stats").onclick = () => {
      updateDisplay(showStats(data));
      updateButtonStates("stats");
    };

    document.getElementById("btn-external").onclick = () => {
      renderExternalView(data);
    };

    renderExternalView(data);
  } catch (error) {
    showError(error.message);
  }
});
