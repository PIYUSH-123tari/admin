function openAgents() {
  window.location.href = "../am/am.html";
}

function openPickup() {
  
  window.location.href = "../adminPUR/adminPickupRequests.html";
}

function openPackages() {
  
  // window.location.href = "packages.html";
}


document.getElementById("logoutBtn").addEventListener("click", () => {
  // Clear everything from localStorage
  localStorage.clear();

  // Redirect to login page
  window.location.href = "../register/register.html";
});
