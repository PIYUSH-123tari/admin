// Restrict past dates
const dateInput = document.getElementById("assigned_date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// Back button
function goBack() {
  window.location.href = "../adminPUR/adminPickupRequests.html";
  localStorage.removeItem("pickupRequestId");
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

document.getElementById("assignmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pickupRequestId = localStorage.getItem("pickupRequestId");

  const assigned_date = document.getElementById("assigned_date").value;
  const assigned_time_raw = document.getElementById("assigned_time").value;
  const agentId = document.getElementById("agentId").value;

  // Convert time format before sending
  const assigned_time = convertTo12Hour(assigned_time_raw);

  const res = await fetch("http://localhost:3500/api/assignment/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pickupRequestId,
      agentId,
      assigned_date,
      assigned_time
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Assignment Created!");
    localStorage.removeItem("pickupRequestId");
    window.location.href = "../adminPUR/adminPickupRequests.html";
  } else {
    alert(data.message);
  }
});