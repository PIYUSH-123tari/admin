document.getElementById("agentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = document.getElementById("agentForm");
  const formData = new FormData(form);

  // region_Id from localStorage
  const regionId = localStorage.getItem("region_Id");
  if (!regionId) {
    alert("Region ID missing");
    return;
  }

  formData.append("region_Id", regionId);

  try {
    const res = await fetch("http://localhost:3500/api/agents/create", {
      method: "POST",
      body: formData
    });
  if(res.ok){
    const data = await res.json();
    alert(data.message);
// Redirect to agent management page
  }
   window.location.href = "../am/am.html";
  } catch (err) {
    console.error(err);
    alert("Error creating agent");
  }
});


document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "../am/am.html";
});
