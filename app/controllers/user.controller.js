const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
exports.findAll = (req, res) => {
   
  
  User.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.updateStatusUser = (req, res) => {
  if (!req.body) {
      return res.status(400).send({
          message: "Data to update can not be empty!"
      });
  }

  const id = req.params.id;
  const newStatus = req.body.status;

  // Update the user's status
  User.findByIdAndUpdate(id, { status: newStatus }, { new: true })
      .then(updatedUser => {
          if (!updatedUser) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ message: 'User updated status successfully', updatedUser });
      })
      .catch(err => {
          console.error('Error updating User status', err);
          res.status(500).json({ error: 'Error updating User status with id=' + id });
      });
}
exports.deleteUserById = async (req, res) => {
  try {
      const UserId = req.params.id;

      // Find the User by ID and delete it
      const deletedUser = await User.findByIdAndRemove(UserId);
      if (!deletedUser) {
          return res.status(404).json({ error: 'user not found' });
      }
      res.status(200).json({ message: 'User deleted successfully', UserId });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
};

// Update a user by the id in the request
exports.updateUserById = async (req, res) => {
  if (!req.body) {
      return res.status(400).send({
          message: "Data to update can not be empty!"
      });
  }

  try {
      const userId = req.params.id;
      const { username, email , name, phone, city} = req.body;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update the user fields
      if (username) {
          user.username = username;
      }
      if (email) {
          user.email = email;
      }
      if (name) {
        user.name = name;
    }
      if (phone) {
      user.phone = phone;
    }
    if (city) {
      user.city = city;
    }



      // Save the updated user
      await user.save();

      res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
};

