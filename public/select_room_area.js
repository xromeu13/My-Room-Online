function toggleFilters() {
    var filters = document.getElementById("filter-options");
    filters.style.display = filters.style.display === "block" ? "none" : "block";
}

function applyFilters() {
    // Logic to filter the areas based on selection
}

function selectArea(area) {
    alert(area + ' area selected');
    // Logic to handle area selection
}

document.getElementById("filter-toggle").addEventListener("click", toggleFilters);

