document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const admin_Id = document.getElementById("loginAdminId").value;

  const authData = { email, password, admin_Id };

  const response = await fetch("http://localhost:3500/managers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData)
  });

  const data = await response.json();
  alert(data.message);

  if (response.ok) {
    localStorage.setItem("admin_Id", data.admin_Id);
    localStorage.setItem("region_Id", data.region_Id);
    window.location.href = "../adminPortal/aP.html";
  }
});
