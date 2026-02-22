document.addEventListener("DOMContentLoaded", () => {

  // 🔙 Back to Admin Portal
  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", () => {
    window.location.href = "../adminPortal/aP.html";
  });

});

// Create Agent
function createAgent() {
  window.location.href = "../createAgent/ca.html";
}

// View / Update / Delete Agents
function manageAgents() {
  window.location.href = "../manageAgents/ga.html";
}

// Agent Status
function agentStatus() {
  window.location.href = "../agentStatus/as.html";
}