document.addEventListener("DOMContentLoaded", async () => {

  const adminId = localStorage.getItem("admin_Id");

  if (!adminId) {
    alert("Admin not logged in");
    return;
  }

  const container = document.getElementById("requestsContainer");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");
  const backBtn = document.getElementById("backBtn");

  // Back button redirect
  backBtn.addEventListener("click", () => {
    window.location.href = "../adminPortal/aP.html";
  });

  try {
    const response = await fetch(`http://localhost:3500/api/admin/pickup-requests/${adminId}`);
    const requests = await response.json();

    container.innerHTML = "";

    if (!requests || requests.length === 0) {
      container.innerHTML = `<div class="no-request">No pickup request yet.</div>`;
      return;
    }

    requests.forEach(request => {

      const card = document.createElement("div");
      card.classList.add("request-card");

      // Status class logic
      let statusClass = "pending";
      if (request.status === "assigned") statusClass = "assigned";
      if (request.status === "collected") statusClass = "collected";

      card.innerHTML = `
        ${
          request.image
            ? `<img src="http://127.0.0.1:5000${request.image}" 
             alt="Waste Image" 
             class="waste-img" />`
            : `<img src="https://via.placeholder.com/600x250?text=No+Image" />`
        }

        <div class="card-content">
          <h3>Category: ${request.category?.category_name || "N/A"}</h3>
          <p><strong>User Name:</strong> ${request.user?.name || "N/A"}</p>
          <p><strong>User Email:</strong> ${request.user?.email || "N/A"}</p>
          <p><strong>User Phone:</strong> ${request.userPhone}</p>
          <p><strong>Description:</strong> ${request.waste_description}</p>
          <p><strong>Estimated Weight:</strong> ${request.estimated_weight} kg</p>
          <p><strong>Pickup Address:</strong> ${request.pickup_address}</p>
          <p><strong>Preferred Date:</strong> ${new Date(request.preferred_date).toLocaleDateString()}</p>

          <p><strong>Status:</strong> 
            <span class="status-badge ${statusClass}">
              ${request.status}
            </span>
          </p>

          <button class="assign-btn">Create Assignment</button>
        </div>
      `;

      container.appendChild(card);

      // Modal Image Click
      const img = card.querySelector("img");
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
      });
    });

    // Close modal
    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

  } catch (error) {
    console.error("Error fetching requests:", error);
  }
});