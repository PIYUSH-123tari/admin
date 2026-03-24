document.addEventListener("DOMContentLoaded", () => {
  loadAgents();

  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", () => {
    window.location.href = "../am/am.html";
  });
});

async function loadAgents() {
  try {
    const token = sessionStorage.getItem("admin_token");
    const res = await fetch("http://localhost:3500/api/agents", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const agents = await res.json();

    const tbody = document.querySelector("#agentTable tbody");
    tbody.innerHTML = "";

    agents.forEach(agent => {

      const statusBadge = agent.status === "available"
        ? `<span class="badge available">Available</span>`
        : `<span class="badge unavailable">Unavailable</span>`;

      const photoHtml = agent.passport_photo
        ? `<img src="${agent.passport_photo}" alt="Photo" class="agent-thumb" />`
        : `<div class="no-photo">No Photo</div>`;

      const isPicking = sessionStorage.getItem("pickingAgentForAssignment") === "true";
      const selectBtnHtml = isPicking 
        ? `<button class="select-agent-btn" onclick="selectAgent('${agent._id}')">Select</button>`
        : '';

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div class="agent-name-cell">
            ${photoHtml}
            <span>${agent.agent_name}</span>
          </div>
        </td>
        <td class="object-id">${agent._id}</td>
        <td>${statusBadge}</td>
        <td>${agent.assigned_pending_order}</td>
        <td>${selectBtnHtml}</td>
      `;

      tbody.appendChild(row);
    });

  } catch (error) {
    alert("Failed to load agents. Make sure backend is running.");
    console.error(error);
  }
}

window.selectAgent = function(agentId) {
  sessionStorage.setItem("selectedAgentId", agentId);
  sessionStorage.removeItem("pickingAgentForAssignment");
  window.location.href = "../createAssign/createAssignment.html";
};