document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const form = document.getElementById("emailForm");
  const emailInput = document.getElementById("emailInput");
  const resultDiv = document.getElementById("result");

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous results
    resultDiv.textContent = "";

    const email = emailInput.value;

    // Emit the email to the server for validation and processing
    socket.emit("emailSubmission", email);
  });

  // Listen for success response from the server
  socket.on("emailSuccess", (data) => {
    resultDiv.textContent = `Success: ${data}`;
    resultDiv.style.color = "green";
  });

  // Listen for error response from the server
  socket.on("emailError", (errorMessage) => {
    resultDiv.textContent = `Error: ${errorMessage}`;
    resultDiv.style.color = "red";
  });
});
