const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    secret: "tennis_secret_key",
    resave: false,
    saveUninitialized: false
}));

const logger = require("./middleware/logger");
app.use(logger);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

app.listen(3000, () => {
    console.log("Premium Tennis App ruleaza pe http://localhost:3000");
});