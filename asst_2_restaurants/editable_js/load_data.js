// ============================================
// DATA LOADING
// ============================================


async function loadData() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error("Could not load data file.");
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error("The dataset is missing restaurant records.");
    }

    return data.features;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from API");
  }
}

export default loadData;


