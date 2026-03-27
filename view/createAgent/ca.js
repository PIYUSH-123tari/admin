const form = document.getElementById("agentForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const backBtn = document.getElementById("backBtn");

const editData = JSON.parse(sessionStorage.getItem("editAgentData"));

// 🔥 Toast Function (Replaced with SweetAlert2)
function showToast(message, type = "success") {
  Swal.fire({
    icon: type,
    title: type === "success" ? "Success!" : "Wait a minute...",
    text: message,
    confirmButtonColor: type === "success" ? "#28a745" : "#d33"
  });
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
  const regionId = sessionStorage.getItem("region_Id");
  formData.append("region", regionId);

  let url = "http://localhost:3500/api/agents/create";
  let method = "POST";

  if (editData) {
    url = `http://localhost:3500/api/agents/update/${editData._id}`;
    method = "PUT";
  }

  try {
    const token = sessionStorage.getItem("admin_token");
    const res = await fetch(url, {
      method,
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Error occurred", "error");
      return;
    }

    if (sessionStorage.getItem("isAutoSave") === "true") {
      // If autosave triggered this, do not block with alert, and don't redirect.
      // Let auth-guard logout timer handle logging out.
      return; 
    }

    alert(data.message);
    
    // Use setTimeout to ensure the redirect fires reliably after the alert is dismissed
    setTimeout(() => {
      sessionStorage.removeItem("editAgentData");
      window.location.href = "../getAgents/ga.html";
    }, 100);

  } catch (err) {
    console.error(err);
    showToast("Server not responding", "error");
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "../am/am.html";
});

// ===== PASSWORD TOGGLE =====
document.querySelector(".eye-toggle").addEventListener("click", function () {
  const input = document.getElementById("agentPassword");
  if (input.type === "password") {
    input.type = "text";
    this.textContent = "🙈";
  } else {
    input.type = "password";
    this.textContent = "👁";
  }
});