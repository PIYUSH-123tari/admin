document.addEventListener("DOMContentLoaded", async () => {

  const pickupId = localStorage.getItem("viewPickupId");
  const container = document.getElementById("assignmentContainer");
  const backBtn = document.getElementById("backBtn");

  // 🔙 Back Button
  backBtn.addEventListener("click", () => {
    localStorage.removeItem("viewPickupId");
    window.location.href = "../adminPUR/adminPickupRequests.html";
  });

  if (!pickupId) {
    container.innerHTML = "<p>No assignment found.</p>";
    return;
  }

  try {

    // 🔹 Get Assignment by Pickup ID
    const res = await fetch(`http://localhost:3500/api/assignment/pickup/${pickupId}`);
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = "<p>Assignment not found.</p>";
      return;
    }

    // 🔹 Check if Collection already exists
    const collectionRes = await fetch(
      `http://localhost:3500/api/collected/assignment/${data._id}`
    );

    let collectionExists = false;

    if (collectionRes.ok) {
      collectionExists = true;
    }

    // 🔹 Render UI
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
            ${
              collectionExists
                ? `<button class="view-btn" id="viewCollection">View Collection</button>`
                : `<button class="create-btn" id="createCollection">Create Collection</button>`
            }
            <button class="delete-btn" id="deleteAssignment">Delete Assignment</button>
          </div>

        </div>
      </div>
    `;

    // 🔹 If collection NOT exists → Show Create
    if (!collectionExists) {

      document.getElementById("createCollection").addEventListener("click", () => {
        localStorage.setItem("assignmentId", data._id);
        localStorage.setItem("agentId", data.agent._id);
        window.location.href = "../createCollection/createCollection.html";
      });

    } else {

      // 🔹 If collection exists → Show View
      document.getElementById("viewCollection").addEventListener("click", () => {
        localStorage.setItem("assignmentId", data._id);
        window.location.href = "../createCollection/viewCollection.html";
      });
    }

    // 🔹 Delete Assignment
    document.getElementById("deleteAssignment").addEventListener("click", async () => {

      if (!confirm("Are you sure you want to delete this assignment?")) return;

      await fetch(`http://localhost:3500/api/assignment/delete/${data._id}`, {
        method: "DELETE"
      });

      alert("Assignment Deleted!");

      localStorage.removeItem("viewPickupId");
      window.location.href = "../adminPUR/adminPickupRequests.html";
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading assignment.</p>";
  }

});