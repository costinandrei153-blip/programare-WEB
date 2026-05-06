const mongoose = require("mongoose");

const Match = require("./models/Match");
const User = require("./models/User");

mongoose.connect(
"mongodb+srv://costin:parola123@cluster0.rh438aw.mongodb.net/tennisApp?retryWrites=true&w=majority"
)

.then(async () => {

    console.log("MongoDB conectat");

    // DELETE EXISTING DATA
    await Match.deleteMany({});
    await User.deleteMany({});

    // CREATE USERS
    const admin = await User.create({
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin"
    });

    const user = await User.create({
        username: "costin",
        email: "costin@gmail.com",
        password: "parola123",
        role: "user"
    });

    // CREATE MATCHES
    const seedMatches = [

        {
            player: "Novak Djokovic",
            opponent: "Carlos Alcaraz",
            score: "6-4 6-3",
            status: "finished",
            tournament: "Grand Slam",
            rounds: 5,
            isFinished: true,
            createdBy: admin._id
        },

        {
            player: "Jannik Sinner",
            opponent: "Daniil Medvedev",
            score: "7-6 6-7 6-4",
            status: "live",
            tournament: "ATP",
            rounds: 3,
            isFinished: false,
            createdBy: user._id
        },

        {
            player: "Rafael Nadal",
            opponent: "Roger Federer",
            score: "6-0 6-0",
            status: "finished",
            tournament: "Grand Slam",
            rounds: 5,
            isFinished: true,
            createdBy: admin._id
        },

        {
            player: "Andy Murray",
            opponent: "Stan Wawrinka",
            score: "6-4 3-6 6-2",
            status: "live",
            tournament: "ATP",
            rounds: 3,
            isFinished: false,
            createdBy: user._id
        },

        {
            player: "Alexander Zverev",
            opponent: "Stefanos Tsitsipas",
            score: "7-5 6-4",
            status: "finished",
            tournament: "ATP",
            rounds: 3,
            isFinished: true,
            createdBy: admin._id
        }

    ];

    await Match.insertMany(seedMatches);

    console.log("Seed complet realizat!");

    mongoose.connection.close();

})

.catch(err => console.log(err));