module.exports = (req, res, next) => {

    console.log(
        `${req.method} ${req.url} - user: ${
            req.session.user
                ? req.session.user.email
                : "anonim"
        }`
    );

    next();
};