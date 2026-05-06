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

    const user = await User.create({
      username,
      email,
      password
    });

    // LOGIN automat
    req.session.user = user;

    // COOKIE
    res.cookie("favoriteTournament", "Wimbledon");

    // redirect
    res.redirect("/dashboard");

  } catch (err) {

    console.log(err);

    if (err.code === 11000) {
      return res.send("Email sau username deja exista.");
    }

    res.send(err.message);
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

        // MATCHES
        const matches = await Match.find()
            .sort({ _id: -1 })
            .populate("createdBy", "email username");

        // STATISTICS
        const totalMatches = await Match.countDocuments();

        const liveMatches = await Match.countDocuments({
            status: "live"
        });

        const finishedMatches = await Match.countDocuments({
            status: "finished"
        });

        res.render("dashboard", {

            user: req.session.user,

            views: req.session.views,

            matches,

            favorite: req.cookies.favoriteTournament,

            totalMatches,

            liveMatches,

            finishedMatches

        });

    } catch (err) {

        console.log(err);

        res.send("Eroare dashboard");

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

// MATCH DETAILS
router.get("/match/:id", requireLogin, async (req, res) => {

  try {

    const match = await Match.findById(req.params.id)
      .populate("createdBy", "username email");

    if (!match) {
      return res.send("Match-ul nu exista.");
    }

    res.render("matchDetails", { match });

  } catch (err) {

    console.log(err);
    res.send("ID invalid.");

  }

});


// EDIT MATCH
router.get("/edit-match/:id", requireLogin, async (req, res) => {
  const match = await Match.findById(req.params.id);
  res.render("editMatch", { match });
});

router.post("/edit-match/:id", requireLogin, async (req, res) => {
  const { player, opponent, score } = req.body;

  await Match.findByIdAndUpdate(
    req.params.id,
    {
        player,
        opponent,
        score
    },
    {
        runValidators: true
    }
);

  res.redirect("/dashboard");
});


// SEARCH
router.get("/search", async (req, res) => {

    try {

        const q = req.query.q;

        const matches = await Match.find({

            $or: [

                {
                    player: {
                        $regex: q,
                        $options: "i"
                    }
                },

                {
                    opponent: {
                        $regex: q,
                        $options: "i"
                    }
                }

            ]

        })

        .sort({ _id: -1 })

        .populate("createdBy", "username email");



        // STATISTICS
        const totalMatches = await Match.countDocuments();

        const liveMatches = await Match.countDocuments({
            status: "live"
        });

        const finishedMatches = await Match.countDocuments({
            status: "finished"
        });



        res.render("dashboard", {

            matches,

            user: req.session.user,

            views: req.session.views || 0,

            favorite: req.cookies.favoriteTournament,

            totalMatches,

            liveMatches,

            finishedMatches

        });

    } catch (err) {

        console.log(err);

        res.send("Eroare la search");

    }

});

// API - toate match-urile
router.get("/api/matches", async (req, res) => {

    try {

        const matches = await Match.find()
        .populate("createdBy", "username email");

        res.json(matches);

    } catch(err) {

        res.status(500).json({
            message: "Eroare server"
        });

    }

});

module.exports = router;