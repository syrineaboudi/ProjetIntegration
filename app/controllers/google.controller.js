const passport = require("passport");
const userModel = require("../models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Configuration des identifiants client
const GOOGLE_CLIENT_ID = "593654934494-nq6hdjuefv0lprgglrm9g4hsp3u4qv52.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// Configuration de Passport pour utiliser la stratégie Google
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const checkIfUserExist = await userModel.findOne({ email: profile.emails[0].value });

        if (checkIfUserExist) {
          return done(null, checkIfUserExist);
        } else {
          // Sinon, créer un nouvel utilisateur dans la base de données
          const user = new userModel({
            username: profile.name.givenName,
            email: profile.emails[0].value,
            role: ["user"] // Set the user role
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuration de la sérialisation et de la désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  // Sauvegarde de l'ID utilisateur dans la session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Récupération de l'ID utilisateur à partir de la session
  // Vous pouvez utiliser cet ID pour charger les informations de l'utilisateur depuis la base de données
  done(null, { id: id, name: "John Doe" }); // Exemple statique
});

// Render the homepage
exports.homepage = (req, res) => {
  res.redirect("http://localhost:4200/");
};

// Authentication avec Google
exports.authenticateGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

// Gestion du callback Google
exports.handleGoogleCallback = passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/dashboard");
};

// Render the dashboard
exports.dashboard = (req, res) => {
  res.render("dashboard.twig", { user: req.user });
  console.log({ user: req.user });
};

// Logout
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
