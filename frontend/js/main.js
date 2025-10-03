// Show the sidebar from mobile view 
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

// Hide the sidebar from mobile view 
function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

// Homepage click more button
document.getElementById("click-more-btn").onclick = function() {
  location.href = "frontend/html/results.html";
};