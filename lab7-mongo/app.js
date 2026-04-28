const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://costin:parola123@cluster0.rh438aw.mongodb.net/students?retryWrites=true&w=majority")
.then(() => console.log("MongoDB conectat"))
.catch(err => console.log(err));

const courseSchema = new mongoose.Schema({
    week: Number,
    course: String,
    project: String
});

const Course = mongoose.model("Course", courseSchema);
Course.insertMany([
 { week: 1, course: "HTML", project: "Personal Page" },
 { week: 2, course: "CSS", project: "Styled Website" },
 { week: 3, course: "JavaScript", project: "Dynamic Form" },
 { week: 4, course: "Node.js", project: "Login System" },
 { week: 5, course: "MongoDB", project: "Students Database" }
]);

app.get("/", async (req, res) => {

    const data = await Course.find();

    res.render("index", { courses: data });

});

app.listen(3000, () => {
    console.log("Server pornit pe http://localhost:3000");
});