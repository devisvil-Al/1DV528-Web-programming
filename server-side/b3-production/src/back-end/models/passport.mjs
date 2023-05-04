import GoogleStrategy from 'passport-google-oauth20';
import GitLabStrategy from 'passport-gitlab2';

export default function (passport) {
  // Google Strategy
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        handleOAuthProfile(profile, 'google', done)
      }
    )
  )

  // GitLab Strategy
  passport.use(
    new GitLabStrategy.Strategy(
      {
        clientID: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET,
        callbackURL: '/auth/gitlab/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        handleOAuthProfile(profile, 'gitlab', done);
      }
    )
  )

  // Serialize user to store in session
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}
async function handleOAuthProfile(profile, provider, done) {
  // console.log(profile)
  // console.log(provider)
  const newUser = {
    provider,
    providerId: profile.id,
    firstName: profile.displayName.split(' ')[0],
    lastName: profile.displayName.split(' ')[1],
    email: profile.emails[0].value,
  }
  done(null, newUser)
}
