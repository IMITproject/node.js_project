//middleware.js
module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.username = req.user.username;
    }
    next();
};
