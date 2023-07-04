const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to the database!");
    initial();
  })
  .catch(err => {
    console.error("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "^_____________^ Welcome to serveur Menumeric application." });
});

//authentification route
require("./app/routes/auth.routes")(app);

//user route 
require("./app/routes/user.routes")(app);

require("./app/routes/reclamation.routes")(app);
require("./app/routes/reponse.routes")(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      const roles = [
        { name: 'user' },
        { name: 'moderator' },
        { name: 'admin' }
      ];

      await Role.insertMany(roles);
      console.log('Roles initialized successfully.');
    }
  } catch (err) {
    console.error('Error initializing roles:', err);
  }
}
