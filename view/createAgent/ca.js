const form = document.getElementById("agentForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const backBtn = document.getElementById("backBtn");

const editData = JSON.parse(localStorage.getItem("editAgentData"));

// 🔥 IF EDIT MODE
if (editData) {

  formTitle.innerText = "UPDATE AGENT";
  submitBtn.innerText = "UPDATE AGENT";

  backBtn.disabled = true;
  backBtn.style.opacity = "0.5";
  backBtn.style.cursor = "not-allowed";

  // Autofill form
  form.agent_name.value = editData.agent_name;
  form.agent_address.value = editData.agent_address;
  form.agent_phoneNo.value = editData.agent_phoneNo;
  form.agent_email.value = editData.agent_email;
  form.status.value = editData.status;

  // Make password & images optional
  form.password.required = false;
  form.password.placeholder = "Leave blank to keep old password";

  form.passport_photo.required = false;
  form.adhar_photo.required = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const regionId = localStorage.getItem("region_Id");

  formData.append("region_Id", regionId);

  let url = "http://localhost:3500/api/agents/create";
  let method = "POST";

  // 🔥 UPDATE MODE
  if (editData) {
    url = `http://localhost:3500/api/agents/update/${editData.agent_Id}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    const data = await res.json();
    alert(data.message);

    // 🔥 Clear localStorage after update
    localStorage.removeItem("editAgentData");

    // Redirect to manage agents
    window.location.href = "../getAgents/ga.html";

  } catch (err) {
    console.error(err);
    alert("Error submitting form");
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "../am/am.html";
});
