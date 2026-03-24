// auth-guard.js
// Included at the top of every protected HTML page to prevent unauthorized access

(function() {
  const token = sessionStorage.getItem("admin_token");
  
  // If no token exists, redirect immediately to login page
  if (!token) {
    // Determine path to register.html from current location
    // Most views are 1 level deep (e.g. view/am/am.html) inside 'view'
    // The register page is view/register/register.html
    window.location.replace("../register/register.html");
  }
})();
