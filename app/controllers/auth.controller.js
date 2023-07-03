const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer');
const crypto = require('crypto');




exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    status: req.body.roles && req.body.roles.includes("admin") ? true : false

  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
/*
exports.signup = (req, res) => {

  console.log({username: req.body.username});
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    //status: req.body.roles ? req.body.roles: false
    status: req.body.roles && req.body.roles.includes("admin")

  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);

          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
}; */ 


exports.signin = (req, res) => {

    User.findOne({
      username: req.body.username,
      //status : req.body.status
  
    })
      .populate("roles", "-__v")
      .exec((err, user) => {

   
  
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        if (!user.status) {
          return res.status(401).json({ message: "Wait for Admin Approval" });
        }else{

          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
    
          var authorities = [];
    
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          }
          res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            name:user.name,
            phone:user.phone,
            city:user.city,
            roles: authorities,
            status: user.status,
            accessToken: token
          });
    
        }
     
      });
  };



  
// AGD TEST mail
// Generate a password reset token
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Send a password reset email
function sendResetEmail(user, token) {
  const transporter = nodemailer.createTransport({
    // Configure your email provider here
    port: 465,
  host: "smtp.gmail.com",
  auth: {
      user: 'khalil.guedoir@esprit.tn',
      pass: 'vdnwxuctswpuvjlq',
  },
  secure: true, 
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: http://localhost:4200/reset-password/${user.id}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Route to initiate password reset
exports.forgotPasswordtest = (req, res) => {
  const email = req.body.email;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    user.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save reset token' });
      }

      sendResetEmail(user, resetToken);
      res.json({ message: 'Password reset email sent' });
    });
  });
};

// Route to handle password reset
exports.resetpasswordtest= (req, res) => {
  const id = req.params.id;
  const { newPassword } = req.body;
  
  User.findById(id, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to hash password' });
        }

        user.password = hashedPassword;

        user.save((err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to reset password' });
          }

          res.json({ message: 'Password reset successful' });
        });
      });
    });
  });
};