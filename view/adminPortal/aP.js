function openAgents() {
  alert("Agents Card Clicked");
  window.location.href = "../am/am.html";
}

function openPickup() {
  alert("Pickup Request & Assignment Clicked");
  window.location.href = "../adminPUR/adminPickupRequests.html";
}

function openPackages() {
  alert("Packages Card Clicked");
  // window.location.href = "packages.html";
}


document.getElementById("logoutBtn").addEventListener("click", () => {
  // Clear everything from localStorage
  localStorage.clear();

  // Redirect to login page
  window.location.href = "../register/register.html";
});
