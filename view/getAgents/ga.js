document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "../am/am.html";
});

// 🔥 Toast Function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function loadAgents() {

  const regionId = localStorage.getItem("region_Id");

  if (!regionId) {
    showToast("Region ID missing", "error");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3500/api/agents/all?region=${regionId}`
    );

    const agents = await res.json();

    if (!Array.isArray(agents)) {
      showToast(agents.message || "Error loading agents", "error");
      return;
    }

    const container = document.getElementById("agentContainer");
    container.innerHTML = "";

    agents.forEach(agent => {

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
          <p><strong>Created On:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
        </div>

        <div class="action-buttons">
          <button class="update-btn" onclick='editAgent(${JSON.stringify(agent)})'>Update</button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    showToast("Error loading agents", "error");
  }
}

function editAgent(agent) {

  const agentData = {
    _id: agent._id,
    agent_name: agent.agent_name,
    agent_address: agent.agent_address,
    agent_phoneNo: agent.agent_phoneNo,
    agent_email: agent.agent_email
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

window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};