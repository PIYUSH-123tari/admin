document.addEventListener("DOMContentLoaded", () => {
  loadAgents();

  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", () => {
    window.location.href = "../am/am.html";
  });
});

async function loadAgents() {
  try {
    const res = await fetch("http://localhost:3500/api/agents");
    const agents = await res.json();

    const tbody = document.querySelector("#agentTable tbody");
    tbody.innerHTML = "";

    agents.forEach(agent => {

      const statusBadge =
        agent.status === "available"
          ? `<span class="badge available">Available</span>`
          : `<span class="badge unavailable">Unavailable</span>`;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${agent.agent_name}</td>
        <td class="object-id">${agent._id}</td>
        <td>${statusBadge}</td>
        <td>${agent.assigned_pending_order}</td>
      `;

      tbody.appendChild(row);
    });

  } catch (error) {
    alert("Failed to load agents. Make sure backend is running.");
    console.error(error);
  }
}