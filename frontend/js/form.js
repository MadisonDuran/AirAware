function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

//Get form and elements
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

//Small helper to clear errors
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
    showError(
      firstName,
      firstNameError,
      "First name must be at least 2 characters"
    );
    return false;
  }

  clearError(firstName, firstNameError);
  return true;
}

function validateLastName() {
  const value = lastName.value.trim(); // remove spaces

  if (value === "") {
    showError(lastName, lastNameError, "Last name is required");
    return false;
  }

  if (value.length < 2) {
    showError(
      lastName,
      lastNameError,
      "Last name must be at least 2 characters"
    );
    return false;
  }

  clearError(lastName, lastNameError);
  return true;
}

//Email check with regex
function validateEmail() {
  const value = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError(email, emailError, "Email is required");
    return false;
  }

  if (!emailPattern.test(value)) {
    // test is regex method to check the pattern
    showError(email, emailError, "Please enter a valid email address");
    return false;
  }

  clearError(email, emailError);
  return true;
}

function validateCountry() {
  const value = country.value; // select the value inside input

  if (value === "") {
    showError(country, countryError, "Please select a country");
    return false;
  }

  clearError(country, countryError);
  return true;
}

//Realtime validation
firstName.addEventListener("input", validateFirstName); //user type runs functions
firstName.addEventListener("blur", validateFirstName); // when user click input runs functions

lastName.addEventListener("input", validateLastName);
lastName.addEventListener("blur", validateLastName);

email.addEventListener("input", validateEmail);
email.addEventListener("blur", validateEmail);

country.addEventListener("change", validateCountry); // runs when user change country in dropdown



