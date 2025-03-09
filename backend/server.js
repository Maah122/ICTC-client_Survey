const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const surveyRoutes = require("./route/surveyRoute");
const officeRoutes = require("./route/officeRoute");
const responseRoutes = require("./route/responseRoute");
const questionOptionRoutes = require("./route/questionOptionRoute");
const infoRoutes = require("./route/infoRoute");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));  // ⬅️ Increase request size limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));  // ⬅️ Increase form data size

// Routes
app.use("/api", infoRoutes);
app.use("/api", questionOptionRoutes);
app.use("/api", responseRoutes);
app.use("/api", surveyRoutes);
app.use("/api", officeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
