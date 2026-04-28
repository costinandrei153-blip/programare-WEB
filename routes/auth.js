const express = require("express");
const router = express.Router();

const users = require("../db/users");
const matches = require("../db/matches");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
    res.render("home", { user: req.session.user });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const { email, password } = req.body;

    const exists = users.find(u => u.email === email);

    if (exists) {
        return res.send("Utilizator existent.");
    }

    users.push({ email, password });

    req.session.user = { email };

    res.cookie("favoriteTournament", "Wimbledon");

    res.redirect("/dashboard");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.send("Date incorecte.");
    }

    req.session.user = user;

    res.redirect("/dashboard");
});

router.get("/dashboard", requireLogin, (req, res) => {

    if (!req.session.views) {
        req.session.views = 0;
    }

    req.session.views++;

    res.render("dashboard", {
        user: req.session.user,
        views: req.session.views,
        matches: matches,
        favorite: req.cookies.favoriteTournament
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;