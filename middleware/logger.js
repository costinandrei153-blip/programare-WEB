module.exports = (req, res, next) => {
    const user = req.session.user ? req.session.user.email : "anonim";
    console.log(`${req.method} ${req.url} - user: ${user}`);
    next();
};