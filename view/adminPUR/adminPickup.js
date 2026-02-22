// ═══════════════════════════════════════════════════
//  Shared Notification Helpers (localStorage-based)
// ═══════════════════════════════════════════════════

const NOTIF_KEY = "admin_pickup_notifications";

function getNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
  catch { return []; }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list.slice(0, 100)));
}

function addNotification(type, message, requestId) {
  const list = getNotifications();
  list.unshift({ id: Date.now(), type, message, requestId: requestId || null, time: new Date().toISOString(), read: false });
  saveNotifications(list);
  updateBadge();
  showToast(type, message);
}

function updateBadge() {
  const badge = document.getElementById("notifBadge");
  if (!badge) return;
  const unread = getNotifications().filter(n => !n.read).length;
  if (unread === 0) { badge.style.display = "none"; return; }
  badge.style.display = "flex";
  badge.textContent = unread > 99 ? "99+" : unread;
}

function showToast(type, message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `
    <span class="toast-icon">${type === "update" ? "✏️" : "🗑️"}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => t.remove(), 320);
  }, 4500);
}

// ═══════════════════════════════════════════════════
//  Polling — detect user-made changes
// ═══════════════════════════════════════════════════

const SNAPSHOT_KEY = "admin_pickup_snapshot";

function getSnapshot() {
  try { return JSON.parse(localStorage.getItem(SNAPSHOT_KEY)) || {}; }
  catch { return {}; }
}

function saveSnapshot(map) {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(map));
}

function buildSnapshot(requests) {
  const map = {};
  requests.forEach(r => {
    map[r._id] = {
      status:            r.status,
      waste_description: r.waste_description,
      estimated_weight:  r.estimated_weight,
      pickup_address:    r.pickup_address,
      preferred_date:    r.preferred_date
    };
  });
  return map;
}

function detectChanges(oldMap, newRequests) {
  const newMap = buildSnapshot(newRequests);

  newRequests.forEach(r => {
    if (!oldMap[r._id]) return; // new request — not a user edit
    const old = oldMap[r._id];
    const diffs = [];
    if (old.status            !== r.status)            diffs.push(`status → "${r.status}"`);
    if (old.waste_description !== r.waste_description) diffs.push("description changed");
    if (String(old.estimated_weight) !== String(r.estimated_weight)) diffs.push("weight changed");
    if (old.pickup_address    !== r.pickup_address)    diffs.push("address changed");
    if (old.preferred_date    !== r.preferred_date)    diffs.push("preferred date changed");

    if (diffs.length > 0) {
      const name = r.user?.name || "A user";
      addNotification("update", `${name}'s request was updated: ${diffs.join(", ")}.`, r._id);
    }
  });

  // Detect deletions
  Object.keys(oldMap).forEach(id => {
    if (!newMap[id]) {
      addNotification("delete", `A pickup request (…${id.slice(-6)}) was deleted by a user.`, id);
    }
  });

  return newMap;
}

async function pollChanges(adminId) {
  try {
    const res  = await fetch(`http://localhost:3500/api/admin/pickup-requests/${adminId}`);
    const data = await res.json();
    const old  = getSnapshot();
    if (Object.keys(old).length > 0) {
      const fresh = detectChanges(old, data);
      saveSnapshot(fresh);
    }
  } catch (e) { console.warn("Poll error:", e); }
}

// ═══════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", async () => {

  const adminId = localStorage.getItem("admin_Id");
  if (!adminId) { alert("Admin not logged in"); return; }

  const container  = document.getElementById("requestsContainer");
  const modal      = document.getElementById("imageModal");
  const modalImg   = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");
  const backBtn    = document.getElementById("backBtn");
  const notifBell  = document.getElementById("notifBell");

  // ── Back button (existing logic unchanged) ──
  backBtn.addEventListener("click", () => {
    window.location.href = "../adminPortal/aP.html";
  });

  // ── Notification bell → open notifications page ──
  notifBell.addEventListener("click", () => {
    window.location.href = "../adminPUR/adminNotifications.html";
  });

  // ── Render initial badge ──
  updateBadge();

  // ── Fetch & render cards ──
  try {
    const response = await fetch(`http://localhost:3500/api/admin/pickup-requests/${adminId}`);
    const requests = await response.json();

    // First load: save snapshot (baseline for future polls)
    const existing = getSnapshot();
    if (Object.keys(existing).length === 0) {
      saveSnapshot(buildSnapshot(requests));
    }

    container.innerHTML = "";

    if (!requests || requests.length === 0) {
      container.innerHTML = `<div class="no-request">No pickup requests yet.</div>`;
      return;
    }

    requests.forEach(request => {
      const card = document.createElement("div");
      card.classList.add("request-card");

      // Status class (existing logic)
      let statusClass = "pending";
      if (request.status === "assigned")  statusClass = "assigned";
      if (request.status === "collected") statusClass = "collected";
      if (request.status === "recycled")  statusClass = "recycled";

      card.innerHTML = `
        <div class="img-wrap">
          ${request.image
            ? `<img src="http://127.0.0.1:5000${request.image}" alt="Waste Image" class="waste-img" />`
            : `<img src="https://via.placeholder.com/600x250?text=No+Image" alt="No Image" />`
          }
        </div>
        <div class="card-content">
          <h3>Category: ${request.category?.category_name || "N/A"}</h3>
          <div class="info-row"><span class="info-label">User Name</span><span class="info-value">${request.user?.name || "N/A"}</span></div>
          <div class="info-row"><span class="info-label">User Email</span><span class="info-value">${request.user?.email || "N/A"}</span></div>
          <div class="info-row"><span class="info-label">User Phone</span><span class="info-value">${request.userPhone}</span></div>
          <div class="info-row"><span class="info-label">Description</span><span class="info-value">${request.waste_description}</span></div>
          <div class="info-row"><span class="info-label">Estimated Weight</span><span class="info-value">${request.estimated_weight} kg</span></div>
          <div class="info-row"><span class="info-label">Pickup Address</span><span class="info-value">${request.pickup_address}</span></div>
          <div class="info-row"><span class="info-label">Preferred Date</span><span class="info-value">${new Date(request.preferred_date).toLocaleDateString()}</span></div>
          <div class="info-row">
            <span class="info-label">Status</span>
            <span class="status-badge ${statusClass}">${request.status}</span>
          </div>
          <div class="card-actions">
            ${request.status === "pending"
              ? `<button class="assign-btn" data-id="${request._id}">Create Assignment</button>`
              : `<button class="view-btn"   data-id="${request._id}">View Assignment</button>`
            }
          </div>
        </div>
      `;

      container.appendChild(card);

      // Create Assignment Click (existing logic)
      const assignBtn = card.querySelector(".assign-btn");
      if (assignBtn) {
        assignBtn.addEventListener("click", () => {
          console.log("Request ID:", assignBtn.dataset.id);
          console.log("Full request:", request);
          localStorage.setItem("pickupRequestId", assignBtn.dataset.id);
          window.location.href = "../createAssign/createAssignment.html";
        });
      }

      // View Assignment Click (existing logic)
      const viewBtn = card.querySelector(".view-btn");
      if (viewBtn) {
        viewBtn.addEventListener("click", () => {
          localStorage.setItem("viewPickupId", viewBtn.dataset.id);
          window.location.href = "../viewAssignment/viewAssignment.html";
        });
      }

      // Modal Image Click (existing logic)
      const img = card.querySelector("img");
      img.addEventListener("click", () => {
        modal.classList.add("active");
        modalImg.src = img.src;
      });
    });

    // Close modal (existing logic)
    closeModal.onclick = () => modal.classList.remove("active");
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };

  } catch (error) {
    console.error("Error fetching requests:", error);
    container.innerHTML = `<div class="no-request">Failed to load requests.</div>`;
  }

  // ── Start polling every 30s ──
  setInterval(() => pollChanges(adminId), 30000);
});