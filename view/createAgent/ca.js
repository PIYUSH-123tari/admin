const form = document.getElementById("agentForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const backBtn = document.getElementById("backBtn");

const editData = JSON.parse(localStorage.getItem("editAgentData"));

// 🔥 Toast Function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);

 setTimeout(() => toast.classList.add("show"), 200);
setTimeout(() => {
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 400);
}, 3000); 
}

// 🔥 IF EDIT MODE
if (editData) {

  formTitle.innerText = "UPDATE AGENT";
  submitBtn.innerText = "UPDATE AGENT";

  backBtn.disabled = true;
  backBtn.style.opacity = "0.5";
  backBtn.style.cursor = "not-allowed";

  form.agent_name.value = editData.agent_name;
  form.agent_address.value = editData.agent_address;
  form.agent_phoneNo.value = editData.agent_phoneNo;
  form.agent_email.value = editData.agent_email;

  form.password.required = false;
  form.password.placeholder = "Leave blank to keep old password";

  form.passport_photo.required = false;
  form.adhar_photo.required = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = form.agent_phoneNo.value.trim();
  const email = form.agent_email.value.trim();

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showToast("Phone must be 10 digits starting 6-9", "error");
    return;
  }

  if (/(\d)\1{5,}/.test(phone)) {
    showToast("Phone cannot repeat same digit 6 times", "error");
    return;
  }

  if (!email.endsWith("@gmail.com")) {
    showToast("Email must end with @gmail.com", "error");
    return;
  }

  const formData = new FormData(form);
  const regionId = localStorage.getItem("region_Id");
  formData.append("region", regionId);

  let url = "http://localhost:3500/api/agents/create";
  let method = "POST";

  if (editData) {
    url = `http://localhost:3500/api/agents/update/${editData._id}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Error occurred", "error");
      return;
    }

    showToast(data.message, "success");

    // 🔥 Do NOT reset immediately
    setTimeout(() => {
      localStorage.removeItem("editAgentData");
      window.location.href = "../getAgents/ga.html";
    }, 2500);

  } catch (err) {
    console.error(err);
    showToast("Server not responding", "error");
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "../am/am.html";
});