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

// Get form and elements
const form = document.getElementById("subscribeForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const country = document.getElementById("country");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");

// Error elements (span)
const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const countryError = document.getElementById("countryError");

// Small helper to clear errors
function showError(input, errorElement, message) {
  input.classList.add("error");
  errorElement.textContent = message;
}

function clearError(input, errorElement) {
  input.classList.remove("error");
  errorElement.textContent = "";
}

function validateFirstName() {
  const value = firstName.value.trim();

  if (value === "") {
    showError(firstName, firstNameError, "First name is required");
    return false;
  }

  if (value.length < 2) {
    showError(firstName, firstNameError, "First name must be at least 2 characters");
    return false;
  }

  clearError(firstName, firstNameError);
  return true;
}

function validateLastName() {
  const value = lastName.value.trim();

  if (value === "") {
    showError(lastName, lastNameError, "Last name is required");
    return false;
  }

  if (value.length < 2) {
    showError(lastName, lastNameError, "Last name must be at least 2 characters");
    return false;
  }

  clearError(lastName, lastNameError);
  return true;
}

// Email check with regex
function validateEmail() {
  const value = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError(email, emailError, "Email is required");
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(email, emailError, "Please enter a valid email address");
    return false;
  }

  clearError(email, emailError);
  return true;
}

function validateCountry() {
  const value = country.value;

  if (value === "") {
    showError(country, countryError, "Please select a country");
    return false;
  }

  clearError(country, countryError);
  return true;
}

// Realtime validation
firstName.addEventListener("input", validateFirstName);
firstName.addEventListener("blur", validateFirstName);

lastName.addEventListener("input", validateLastName);
lastName.addEventListener("blur", validateLastName);

email.addEventListener("input", validateEmail);
email.addEventListener("blur", validateEmail);

country.addEventListener("change", validateCountry);

// Form submit with real API call
async function handleSubmit(e) {
  e.preventDefault();

  // Validate all fields
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isCountryValid = validateCountry();

  if (isFirstNameValid && isLastNameValid && isEmailValid && isCountryValid) {
    // Disable button and show loading text
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim(),
          country: country.value,
        }),
      });

      if (response.ok) {
        successMessage.classList.add("show");

        // Reset the form
        form.reset();

        // Hide success after 4s
        setTimeout(() => {
          successMessage.classList.remove("show");
        }, 4000);
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.error || "Something went wrong"));
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      // Re-enable the button
      submitBtn.disabled = false;
      submitBtn.textContent = "Subscribe";
    }
  }
}

form.addEventListener("submit", handleSubmit);
