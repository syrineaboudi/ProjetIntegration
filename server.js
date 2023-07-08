const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const path = require("path");
const socketIO = require('socket.io');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const app = express();
const server = http.createServer(app);

app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:4100","http://localhost:4200"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

var corsOptions = {
  origin: ["http://localhost:4100","http://localhost:4200"]
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
app.use('/public/productImages', express.static(path.join(__dirname, 'public/productImages')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

io.on("connection", (socket) => {
  console.log("Nouvelle connexion Socket.io");

  // Gérez les événements de notification
  socket.on("addReclamation", (data) => {
    console.log("Nouvelle réclamation ajoutée:", data);

    // Émettez un événement "newNotification" à tous les clients connectés
    io.emit("newNotification", {
      client: data.client,
      message: "votre réclamation envoyéé",
    });
  });

  // Autres gestionnaires d'événements Socket.io...
});

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

// product route 
require("./app/routes/product.routes")(app);

// category route 
require("./app/routes/category.routes")(app);
// order route 
require("./app/routes/order.routes")(app);
const googleRoutes = require("./app/routes/google.routes");
app.use(googleRoutes);

// dashboard route 
require("./app/routes/dashboard.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
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

