const passport = require('passport')

module.exports = (app) => {

    app.get('/auth/google', passport.authenticate('google', {
        //ask for specific pieces of an user account
        scope: ['profile', 'email']
    }))

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys')
        }
    )

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/')
    })

    app.get('/api/current_user', (req, res) => { 
        console.log(req.user)
        res.send(req.user)
    })

}