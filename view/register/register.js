// Clear form fields to prevent browser autofill
window.onload = function() {
  setTimeout(() => {
    document.getElementById("loginForm").reset();
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginAdminId").value = "";
    document.getElementById("loginPassword").value = "";
  }, 50);
};
// ===== PASSWORD TOGGLE =====
document.querySelector(".eye").addEventListener("click", function () {
  const input = document.getElementById("loginPassword");
  if (input.type === "password") {
    input.type = "text";
    this.textContent = "🙈";
  } else {
    input.type = "password";
    this.textContent = "👁";
  }
});
// Prevent going back to guarded pages from login page
window.history.pushState(null, "", window.location.href);
window.onpopstate = function() {
  window.history.pushState(null, "", window.location.href);
  Swal.fire({
    icon: 'warning',
    title: 'Please Login',
    text: 'You must be logged in to access the dashboard.',
    confirmButtonColor: '#28a745'
  });
};

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

  if (response.ok) {
    Swal.fire({
      icon: 'success',
      title: 'Welcome Back!',
      text: data.message,
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      sessionStorage.setItem("admin_token", data.token);
      sessionStorage.setItem("admin_Id", data.admin_Id);
      sessionStorage.setItem("region_Id", data.region_Id);
      window.location.href = "../adminPortal/aP.html";
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: data.message,
      confirmButtonColor: '#d33'
    });
  }
});
