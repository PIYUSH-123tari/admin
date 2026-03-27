// auth-guard.js
// Included at the top of every protected HTML page to prevent unauthorized access

(function() {
  function checkAuth() {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      window.location.replace("../register/register.html");
    }
  }

  // Check immediately
  checkAuth();

  // Check when page is loaded from back/forward cache
  window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
      checkAuth();
    }
  });

  // Inject SweetAlert2 so all protected pages can use beautiful popups
  const swalScript = document.createElement("script");
  swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  document.head.appendChild(swalScript);

  // --- INACTIVITY & AUTOSAVE LOGIC ---
  const INACTIVITY_TIME_MS = 3 * 60 * 1000; // 3 minutes
  let inactivityTimer;

  function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(handleSessionTimeout, INACTIVITY_TIME_MS);
  }

  function handleSessionTimeout() {
    // Check if we are in "Update" mode for Agent, Assignment or Collection
    const isEditing = sessionStorage.getItem("editAgentData") || 
                      sessionStorage.getItem("editAssignmentData") || 
                      sessionStorage.getItem("editCollectionData");
                      
    const form = document.querySelector('form');
    
    if (isEditing && form) {
      // Set flag to tell the form logic to suppress alerts and not redirect
      sessionStorage.setItem("isAutoSave", "true");
      
      // Trigger Auto-Save
      const submitBtn = document.getElementById("submitBtn") || 
                        form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      } else {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
      
      // Give it 4 seconds to save before logging out to ensure network requests finish
      setTimeout(() => {
        sessionStorage.removeItem("isAutoSave");
        logoutUser();
      }, 4000);
    } else {
      // Not editing, log out immediately
      logoutUser();
    }
  }

  function logoutUser() {
    // Wait until Swal script is loaded
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired due to inactivity. Please login again.',
        confirmButtonColor: '#1a6b3c',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      }).then(() => {
        executeLogout();
      });
    } else {
      alert("Your session has expired due to inactivity. Please login again.");
      executeLogout();
    }
  }

  function executeLogout() {
    sessionStorage.removeItem("admin_token");
    window.location.replace("../register/register.html");
  }

  // Bind activity events
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  window.addEventListener('click', resetTimer);
  window.addEventListener('scroll', resetTimer);

  // Start the timer initially
  resetTimer();

})();
