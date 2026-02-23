// view/adminN/adminNotifications.js

const BASE = "http://localhost:3500/api/admin/notifications";
let currentFilter = "all";
let allLogs       = [];

function formatTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? "s" : ""} ago`;
}

function render() {
  const container = document.getElementById("notifContainer");
  const list = currentFilter === "all" ? allLogs : allLogs.filter(n => n.type === currentFilter);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <h3>All clear!</h3>
        <p>No ${currentFilter === "all" ? "" : currentFilter + " "}notifications yet.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="notif-card type-${n.type} ${n.read ? "" : "unread"}">
      <div class="notif-icon-wrap">${n.type === "update" ? "✏️" : "🗑️"}</div>
      <div class="notif-body">
        <span class="notif-type-label">${n.type === "update" ? "Request Updated" : "Request Deleted"}</span>
        <p class="notif-message">${n.message}</p>
        ${n.snapshot && (n.snapshot.description || n.snapshot.category) ? `
          <div class="snapshot-box">
            ${n.snapshot.category    ? `<span class="snap-item">📦 ${n.snapshot.category}</span>`                            : ""}
            ${n.snapshot.description ? `<span class="snap-item">📝 ${n.snapshot.description}</span>`                         : ""}
            ${n.snapshot.weight      ? `<span class="snap-item">⚖️ ${n.snapshot.weight} kg</span>`                           : ""}
            ${n.snapshot.address     ? `<span class="snap-item">📍 ${n.snapshot.address}</span>`                             : ""}
            ${n.snapshot.date        ? `<span class="snap-item">📅 ${new Date(n.snapshot.date).toLocaleDateString()}</span>` : ""}
          </div>` : ""}
        <div class="notif-meta">
          <span class="notif-time">${formatTime(n.createdAt)}</span>
          ${n.user?.name  ? `<span class="notif-user">👤 ${n.user.name}</span>`  : ""}
          ${n.user?.email ? `<span class="notif-user">${n.user.email}</span>`    : ""}
        </div>
      </div>
      ${!n.read ? `<div class="unread-dot"></div>` : ""}
      <button class="dismiss-btn" data-id="${n._id}">×</button>
    </div>
  `).join("");

  container.querySelectorAll(".dismiss-btn").forEach(btn => {
    btn.addEventListener("click", () => dismissLog(btn.dataset.id));
  });
}

async function dismissLog(logId) {
  try {
    await fetch(`${BASE}/${logId}`, { method: "DELETE" });
    allLogs = allLogs.filter(n => n._id !== logId);
    render();
  } catch (e) {
    console.error("Dismiss error:", e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  const adminId = localStorage.getItem("admin_Id");
  if (!adminId) { alert("Admin not logged in"); return; }

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../adminPUR/adminPickupRequests.html";
  });

  document.getElementById("clearAllBtn").addEventListener("click", async () => {
    try {
      await fetch(`${BASE}/clear/${adminId}`, { method: "DELETE" });
      allLogs = [];
      render();
    } catch (e) { console.error("Clear error:", e); }
  });

  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      render();
    });
  });

  // Fetch logs — safely handle non-array responses
  try {
    const res  = await fetch(`${BASE}/${adminId}`);
    const data = await res.json();

    // Guard: ensure it's an array
    allLogs = Array.isArray(data) ? data : [];

    // Mark all as read
    await fetch(`${BASE}/mark-read/${adminId}`, { method: "PATCH" });

    render();
  } catch (e) {
    console.error("Failed to load notifications:", e);
    allLogs = [];
    render();
  }
});