import express from 'express'
import passport from 'passport';
import UserController from '../controllers/userController.mjs';

const oauthRouter = express.Router()

export default oauthRouter


// oauthRouter.get('/google', (req, res, next) => {
//   const method = req.query.method || 'login';
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     state: method
//   })(req, res, next);
// });




oauthRouter.get('/google', (req, res, next) => {
  const method = req.query.method || 'login';

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: method
  }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    // If user is authenticated, redirect to callback URL
    if (user) {
      return res.redirect(info.redirectTo);
    }

    // Add the state parameter to the authorization URL
    const authURL = info.authURL + '&state=' + encodeURIComponent(method);
    res.redirect(authURL);
  })(req, res, next);
});



// Google OAuth callback route
oauthRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res, next) => {
    if (req.query.state === 'register') {
      await UserController.register(req, res, next)
    } else if (req.query.state === 'login') {
      await UserController.login(req, res, next)
    }
  }
  
)



oauthRouter.get('/gitlab', (req, res, next) => {
  const method = req.query.method || 'login';
  passport.authenticate('gitlab', {
    scope: ['read_user'],
    state: method
  })(req, res, next);
});



// GitLab OAuth callback route
oauthRouter.get('/gitlab/callback', 
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  async (req, res, next) => {
    if (req.query.state === 'register') {
      await UserController.register(req, res, next)
    } else if (req.query.state === 'login') {
      await UserController.login(req, res, next)
    }
  }
  
)

oauthRouter.get('*', (req, res) => {
  console.log(req.url)
})

