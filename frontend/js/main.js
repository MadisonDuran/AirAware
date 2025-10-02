function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

fetch('http://localhost:5000/api/submissions')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching submissions:', error);
  });
console.log("Running from frontend/js/main.js");

fetch('http://localhost:3000/homepage')

.then(res => res.json())
.then(data => {
    const list = document.getElementById('book-list');
    data.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.authorFirstName}`;
        list.appendChild(li);
    });
})