function openAgents() {
  window.location.href = "../am/am.html";
}

function openPickup() {
  
  window.location.href = "../adminPUR/adminPickupRequests.html";
}

function openPackages() {
  window.location.href = "../warehouse/warehouse.html";
}


document.getElementById("logoutBtn").addEventListener("click", () => {
  // Clear everything from sessionStorage
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "../register/register.html";
});
