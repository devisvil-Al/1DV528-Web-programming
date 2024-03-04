import GitLabStrategy from 'passport-gitlab2';

// модель авторизации GitLab
export default function (passport) {
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
  const newUser = {
    provider,
    providerId: profile.id,
    firstName: profile.displayName.split(' ')[0],
    lastName: profile.displayName.split(' ')[1],
    email: profile.emails[0].value,
  }
  done(null, newUser)
}
