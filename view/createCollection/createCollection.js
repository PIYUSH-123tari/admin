const assignmentId = localStorage.getItem("assignmentId");
const agentId = localStorage.getItem("agentId");

if (!assignmentId || !agentId) {
  alert("Invalid Access");
  window.location.href = "../adminPUR/adminPickupRequests.html";
}

// Load categories
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("http://localhost:3500/api/category");
  const categories = await res.json();

  const select = document.getElementById("category");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat._id; // store ObjectId
    option.textContent = cat.category_name; // display name
    select.appendChild(option);
  });
});

// Submit Form
document.getElementById("collectionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const categoryId = document.getElementById("category").value;
  const product_description = document.getElementById("product_description").value;
  const actual_weight = document.getElementById("actual_weight").value;
  const received_time = document.getElementById("received_time").value;

  const res = await fetch("http://localhost:3500/api/collected/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignmentId,
      agentId,
      categoryId,
      product_description,
      actual_weight,
      received_time
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Collection Created Successfully!");

    localStorage.removeItem("assignmentId");
    localStorage.removeItem("agentId");

    window.location.href = "../viewAssignment/viewAssignment.html";
  } else {
    alert(data.message);
  }
});

function goBack() {
  window.location.href = "../viewAssignment/viewAssignment.html";
}