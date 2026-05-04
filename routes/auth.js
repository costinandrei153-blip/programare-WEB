const express = require("express");
const router = express.Router();

const requireLogin = require("../middleware/requireLogin");
const Match = require("../models/Match");


// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});
// HOME
router.get("/", (req, res) => {
    res.render("home", { user: req.session.user });
});


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await User.create({ username, email, password });

    res.redirect("/login");

  } catch (err) {
    console.log(err); // (vezi eroarea reală)

    if (err.code === 11000) {
      return res.send("Email sau username deja exista.");
    }

    res.send("Eroare la register");
  }
});

// LOGIN
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("Date incorecte.");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.send("Date incorecte.");
    }

    req.session.user = user;
    res.redirect("/dashboard");
});


// DASHBOARD
router.get("/dashboard", requireLogin, async (req, res) => {
    try {

        if (!req.session.views) {
            req.session.views = 0;
        }

        req.session.views++;

        const matches = await Match.find()
            .sort({ _id: -1 }) //
            .populate("createdBy", "email");

        res.render("dashboard", {
            user: req.session.user,
            views: req.session.views,
            matches: matches,
            favorite: req.cookies.favoriteTournament
        });

    } catch (err) {
        console.log(err);
    }
});


// ADD MATCH
router.get("/add-match", requireLogin, (req, res) => {
  res.render("addMatch");
});

router.post("/add-match", requireLogin, async (req, res) => {
  try {
    const { player, opponent, score } = req.body;

    await Match.create({
      player,
      opponent,
      score,
      createdBy: req.session.user._id || null
    });

    res.redirect("/dashboard");

  } catch (err) {
    console.log(err);
    res.send("Eroare la salvare");
  }
});


// DELETE
router.post("/delete-match/:id", requireLogin, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});


// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});


// EDIT MATCH
router.get("/edit-match/:id", requireLogin, async (req, res) => {
  const match = await Match.findById(req.params.id);
  res.render("editMatch", { match });
});

router.post("/edit-match/:id", requireLogin, async (req, res) => {
  const { player, opponent, score } = req.body;

  await Match.findByIdAndUpdate(req.params.id, {
    player,
    opponent,
    score
  });

  res.redirect("/dashboard");
});


// SEARCH
router.get("/search", async (req, res) => {
    try {
        const q = req.query.q;

        const matches = await Match.find({
            $or: [
                { player: { $regex: q, $options: "i" } },
                { opponent: { $regex: q, $options: "i" } }
            ]
        })
        .sort({ _id: -1 }) 
        .populate("createdBy", "email"); 

        res.render("dashboard", {
            matches,
            user: req.session.user,
            views: req.session.views || 0,
            favorite: req.cookies.favoriteTournament
        });

    } catch (err) {
        console.log(err);
        res.send("Eroare la search");
    }
});

module.exports = router;