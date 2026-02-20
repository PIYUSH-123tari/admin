document.addEventListener("DOMContentLoaded", async () => {

  const adminId = localStorage.getItem("admin_Id");

  if (!adminId) {
    alert("Admin not logged in");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3500/api/admin/pickup-requests/${adminId}`);
    const requests = await response.json();

    const container = document.getElementById("requestsContainer");
    container.innerHTML = "";

    if (requests.length === 0) {
      container.innerHTML = "<p>No pickup requests found.</p>";
      return;
    }

    requests.forEach(request => {

      const card = document.createElement("div");
      card.classList.add("request-card");

      card.innerHTML = `
       <h3>Category: ${request.category?.category_name || "N/A"}</h3>
        <p><strong>User Name:</strong> ${request.user?.name || "N/A"}</p>
        <p><strong>User Email:</strong> ${request.user?.email || "N/A"}</p>
        <p><strong>User Phone:</strong> ${request.userPhone}</p>
        <p><strong>Description:</strong> ${request.waste_description}</p>
        <p><strong>Estimated Weight:</strong> ${request.estimated_weight} kg</p>
        <p><strong>Pickup Address:</strong> ${request.pickup_address}</p>
        <p><strong>Preferred Date:</strong> ${new Date(request.preferred_date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${request.status}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching requests:", error);
  }
});