function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('subscribeForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Collect form data
      const data = {
        first_name: form.firstName.value,
        last_name: form.lastName.value,
        email: form.email.value,
        country: form.country.value,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      // Send data to backend
      fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        document.getElementById('successMessage').style.display = 'block';
        form.reset();
      })
      .catch(error => {
        alert('Error submitting form.');
        console.error('Submission error:', error);
      });
    });
  }
});

