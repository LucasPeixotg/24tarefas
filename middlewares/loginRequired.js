function loginRequired(req, res, next) {
    if(!req.session.user) {
        return res.redirect('/auth/login')
    } else {
        next()
    }
}

module.exports = loginRequired