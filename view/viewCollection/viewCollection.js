// Toggle description expand/collapse
function toggleDesc(id, btn) {
  const span = document.getElementById(id);
  const isExpanded = span.classList.toggle("expanded");
  btn.textContent = isExpanded ? "Show less" : "Read more";
}

document.addEventListener("DOMContentLoaded", async () => {

  // ── Back button: clear assignmentId and navigate ──
  document.getElementById("backBtn").addEventListener("click", () => {
    localStorage.removeItem("assignmentId");
    window.location.href = "../viewAssignment/viewAssignment.html";
  });

  // ── Load collection data ──
  const loadingState = document.getElementById("loadingState");
  const emptyState   = document.getElementById("emptyState");
  const tableEl      = document.getElementById("collectionTable");
  const tbody        = document.getElementById("collectionBody");

  try {
    const res  = await fetch("http://localhost:3500/api/collected");
    const data = await res.json();

    loadingState.style.display = "none";

    if (!data || data.length === 0) {
      emptyState.style.display = "flex";
      return;
    }

    tableEl.style.display = "table";

    const CHAR_LIMIT = 80;

    data.forEach((item, index) => {
      const row = document.createElement("tr");

      const assignmentId = item.assignment?._id || "N/A";
      const category     = item.category?.category_name || "N/A";
      const description  = item.product_description || "—";
      const weight       = item.actual_weight != null ? item.actual_weight : "—";
      const dateTime     = item.received_time
        ? new Date(item.received_time).toLocaleString()
        : "—";

      const descId  = `desc-${index}`;
      const isLong  = description.length > CHAR_LIMIT;

      row.innerHTML = `
        <td>${assignmentId}</td>
        <td><span>${category}</span></td>
        <td class="desc-cell">
          <span class="desc-text" id="${descId}">${description}</span>
          ${isLong ? `<button class="read-more-btn" onclick="toggleDesc('${descId}', this)">Read more</button>` : ""}
        </td>
        <td>${weight}</td>
        <td>${dateTime}</td>
      `;

      tbody.appendChild(row);
    });

  } catch (error) {
    loadingState.style.display = "none";
    emptyState.style.display   = "flex";
    emptyState.querySelector("p").textContent = "Failed to load records. Check your connection.";
    console.error("Error loading collections:", error);
  }
});