// Restrict past dates
const dateInput = document.getElementById("assigned_date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// Back button
function goBack() {
  window.location.href = "../adminPUR/adminPickupRequests.html";
  sessionStorage.removeItem("pickupRequestId");
}

// Convert 24hr time to 12hr AM/PM format
function convertTo12Hour(time24) {
  const [hour, minute, second] = time24.split(":");

  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12; // 0 becomes 12

  return `${h}:${minute}:${second} ${ampm}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Restore form state
  const savedDate = sessionStorage.getItem("saved_assigned_date");
  if (savedDate) document.getElementById("assigned_date").value = savedDate;
  
  const savedTime = sessionStorage.getItem("saved_assigned_time");
  if (savedTime) document.getElementById("assigned_time").value = savedTime;

  // Retrieve selected Agent ID from status page
  const selectedAgentId = sessionStorage.getItem("selectedAgentId");
  if (selectedAgentId) {
    document.getElementById("agentId").value = selectedAgentId;
    sessionStorage.removeItem("selectedAgentId"); // Clean up
  }
});

function openAgentSelection() {
  // Save form fields before navigating
  sessionStorage.setItem("saved_assigned_date", document.getElementById("assigned_date").value);
  sessionStorage.setItem("saved_assigned_time", document.getElementById("assigned_time").value);
  sessionStorage.setItem("pickingAgentForAssignment", "true");
  
  window.location.href = "../agentStatus/as.html";
}

document.getElementById("assignmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pickupRequestId = sessionStorage.getItem("pickupRequestId");

  const assigned_date = document.getElementById("assigned_date").value;
  const assigned_time_raw = document.getElementById("assigned_time").value;
  const agentId = document.getElementById("agentId").value;

  // Convert time format before sending
  const assigned_time = convertTo12Hour(assigned_time_raw);

  const token = sessionStorage.getItem("admin_token");
  const res = await fetch("http://localhost:3500/api/assignment/create", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      pickupRequestId,
      agentId,
      assigned_date,
      assigned_time
    })
  });

  const data = await res.json();

  if (res.ok) {
    await Swal.fire("Success!", "Assignment Created!", "success");
    sessionStorage.removeItem("pickupRequestId");
    window.location.href = "../adminPUR/adminPickupRequests.html";
  } else {
    Swal.fire("Error!", data.message, "error");
  }
});