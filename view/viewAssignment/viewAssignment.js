document.addEventListener("DOMContentLoaded", async () => {

  const pickupId  = localStorage.getItem("viewPickupId");
  const container = document.getElementById("assignmentContainer");
  const backBtn   = document.getElementById("backBtn");

  // 🔙 Back Button (existing logic unchanged)
  backBtn.addEventListener("click", () => {
    localStorage.removeItem("viewPickupId");
    window.location.href = "../adminPUR/adminPickupRequests.html";
  });

  if (!pickupId) {
    container.innerHTML = "<p>No assignment found.</p>";
    return;
  }

  try {
    // 🔹 Get Assignment by Pickup ID (existing logic unchanged)
    const res  = await fetch(`http://localhost:3500/api/assignment/pickup/${pickupId}`);
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = "<p>Assignment not found.</p>";
      return;
    }

    // 🔹 Check if Collection already exists (existing logic unchanged)
    const collectionRes = await fetch(
      `http://localhost:3500/api/collected/assignment/${data._id}`
    );
    const collectionExists = collectionRes.ok;

    // 🔹 If collection exists, get its _id for delete button
    let collectedId = null;
    if (collectionExists) {
      const collectionData = await collectionRes.json();
      collectedId = collectionData._id;
    }

    // 🔹 Render UI (existing structure unchanged)
    container.innerHTML = `
      <div class="container">
        <div class="card">

          <p class="section-title">Assignment Info</p>
          <p><strong>Assigned Date:</strong> ${new Date(data.assigned_date).toLocaleDateString()}</p>
          <p><strong>Assigned Time:</strong> ${data.assigned_time}</p>

          <p class="section-title">Agent Info</p>
          <p><strong>Name:</strong> ${data.agent.agent_name}</p>
          <p><strong>Phone:</strong> ${data.agent.agent_phoneNo}</p>
          <p><strong>Email:</strong> ${data.agent.agent_email}</p>

          <div class="btn-group">
            ${collectionExists
              ? `<button class="view-btn"   id="viewCollection">View Collection</button>
                 <button class="delete-btn" id="deleteCollection">Delete Collection</button>`
              : `<button class="create-btn" id="createCollection">Create Collection</button>`
            }
            <button class="delete-btn" id="deleteAssignment">Delete Assignment</button>
          </div>

        </div>
      </div>
    `;

    // 🔹 Create Collection (existing logic unchanged)
    if (!collectionExists) {
      document.getElementById("createCollection").addEventListener("click", () => {
        localStorage.setItem("assignmentId", data._id);
        localStorage.setItem("agentId", data.agent._id);
        window.location.href = "../createCollection/createCollection.html";
      });
    } else {
      // 🔹 View Collection (existing logic unchanged)
      document.getElementById("viewCollection").addEventListener("click", () => {
        localStorage.setItem("assignmentId", data._id);
        window.location.href = "../viewCollection/viewCollection.html";
      });

      // 🔹 NEW: Delete Collection
      document.getElementById("deleteCollection").addEventListener("click", async () => {
        if (!confirm("Delete this collection? The pickup status will revert to 'assigned'.")) return;

        const delRes = await fetch(
          `http://localhost:3500/api/collected/delete/${collectedId}`,
          { method: "DELETE" }
        );
        const delData = await delRes.json();

        if (delRes.ok) {
          alert("Collection deleted! Pickup status reverted to assigned.");
          // Reload page to reflect changes
          window.location.reload();
        } else {
          alert(delData.message || "Failed to delete collection.");
        }
      });
    }

    // 🔹 Delete Assignment (updated to use new route)
    document.getElementById("deleteAssignment").addEventListener("click", async () => {
      if (!confirm("Delete this assignment? This will also delete any related collection and revert pickup status to 'pending'.")) return;

      const delRes = await fetch(
        `http://localhost:3500/api/assignment/delete/${data._id}`,
        { method: "DELETE" }
      );
      const delData = await delRes.json();

      if (delRes.ok) {
        alert("Assignment deleted!");
        localStorage.removeItem("viewPickupId");
        window.location.href = "../adminPUR/adminPickupRequests.html";
      } else {
        alert(delData.message || "Failed to delete assignment.");
      }
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading assignment.</p>";
  }
});