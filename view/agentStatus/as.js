document.addEventListener("DOMContentLoaded", loadAgents);

async function loadAgents() {
  const res = await fetch("http://localhost:3500/api/agents");
  const agents = await res.json();

  const tbody = document.querySelector("#agentTable tbody");
  tbody.innerHTML = "";

  agents.forEach(agent => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${agent.agent_name}</td>
      <td>${agent.agent_Id}</td>
      <td>
        <select id="status-${agent._id}">
          <option value="available" ${agent.status === "available" ? "selected" : ""}>Available</option>
          <option value="unavailable" ${agent.status === "unavailable" ? "selected" : ""}>Unavailable</option>
        </select>
      </td>
      <td>
        <input type="number" min="0" id="orders-${agent._id}" value="${agent.assigned_pending_order}">
      </td>
      <td>
        <button onclick="updateAgent('${agent._id}')">Update</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

async function updateAgent(id) {
  const status = document.getElementById(`status-${id}`).value;
  let orders = document.getElementById(`orders-${id}`).value;

  if (orders < 0) {
    alert("Assigned orders cannot be negative");
    return;
  }

  await fetch(`http://localhost:3500/api/agents/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status,
      assigned_pending_order: orders
    })
  });

  alert("Agent updated successfully!");
}
