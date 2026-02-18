document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "../am/am.html";
});

async function loadAgents() {

  const regionId = localStorage.getItem("region_Id");

  if (!regionId) {
    alert("Region ID missing");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3500/api/agents/all?region_Id=${regionId}`
    );

    const agents = await res.json();

    const container = document.getElementById("agentContainer");
    container.innerHTML = "";

    

    agents.forEach(agent => {

  const statusClass =
    agent.status === "available"
      ? "status-available"
      : "status-unavailable";

  // ✅ Format Created Date & Time
  const createdDate = new Date(agent.createdAt);

  const formattedDate = createdDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedTime = createdDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const card = document.createElement("div");
  card.classList.add("agent-card");

  card.innerHTML = `
    <div class="image-row">

      <div class="image-box">
        <img src="http://localhost:3500/${agent.passport_photo}" onclick="openModal(this.src)" />
        <p>Passport Size Photo</p>
      </div>

      <div class="image-box">
       <img src="http://localhost:3500/${agent.adhar_photo}" onclick="openModal(this.src)" />
        <p>Aadhar Card Copy</p>
      </div>

    </div>

    <div class="agent-details">
      <h3>${agent.agent_name}</h3>
      <p><strong>Email:</strong> ${agent.agent_email}</p>
      <p><strong>Phone:</strong> ${agent.agent_phoneNo}</p>
      <p><strong>Address:</strong> ${agent.agent_address}</p>
      <p>Status: <span class="${statusClass}">${agent.status}</span></p>
      <p><strong>Created On:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
    </div>

    <div class="action-buttons">
      <button class="update-btn" onclick='editAgent(${JSON.stringify(agent)})'>Update</button>

      <button class="delete-btn" onclick="deleteAgent('${agent._id}')">Delete</button>
    </div>
  `;

  container.appendChild(card);
});

  } catch (err) {
    console.error(err);
    alert("Error loading agents");
  }
}

async function deleteAgent(id) {

  if (!confirm("Are you sure to delete this agent?")) return;

  try {
    const res = await fetch(
      `http://localhost:3500/api/agents/delete/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();
    alert(data.message);

    loadAgents();

  } catch (err) {
    console.error(err);
    alert("Error deleting agent");
  }
}

function editAgent(agent) {

  const agentData = {
    agent_Id: agent.agent_Id,
    agent_name: agent.agent_name,
    agent_address: agent.agent_address,
    agent_phoneNo: agent.agent_phoneNo,
    agent_email: agent.agent_email,
    status: agent.status
  };

  localStorage.setItem("editAgentData", JSON.stringify(agentData));

  window.location.href = "../createAgent/ca.html";
}




loadAgents();


function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "block";
  modalImg.src = imageSrc;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// Close when clicking outside image
window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
