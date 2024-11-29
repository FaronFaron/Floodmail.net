const express = require("express");
const axios = require("axios");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle email submission
  socket.on("emailSubmission", async (email) => {
    if (!validateEmail(email)) {
      socket.emit("emailError", "Invalid Email");
      return;
    }

    try {
      const response = await axios.get("https://floodmail.net/free", {
        params: { email },
        headers: { "User-Agent": "floodmailprivateservices" },
      });

      socket.emit("emailSuccess", response.data);
    } catch (error) {
      socket.emit("emailError", "Floodmail.net Not Responding!");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Function to validate the email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
