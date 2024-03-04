import express from 'express'
import passport from 'passport';

const oauthRouter = express.Router()

export default oauthRouter

// роут авторизации
oauthRouter.get('/gitlab', (req, res, next) => {
  const method = req.query.method || 'login';
  passport.authenticate('gitlab', {
    scope: ['read_user'],
    state: method
  })(req, res, next);
});



