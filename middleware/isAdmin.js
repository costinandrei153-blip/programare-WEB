module.exports = (req, res, next) => {

    if (
        req.session.user &&
        req.session.user.role === "admin"
    ) {
        return next();
    }

    res.send("Acces interzis");
};
const isAdmin = require("../middleware/isAdmin");

router.post(
    "/delete-match/:id",
    requireLogin,
    isAdmin,
    async (req, res) => {

        await Match.findByIdAndDelete(req.params.id);

        res.redirect("/dashboard");
});