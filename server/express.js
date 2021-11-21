const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");

const template = require("../template");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollRoutes = require("./routes/enrollRoutes");

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

// --- Routes ----

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", courseRoutes);
app.use("/", enrollRoutes);

// catching un-authorized errors.
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ":" + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ":" + err.message });
    console.log(err);
  }
});

module.exports = app;
