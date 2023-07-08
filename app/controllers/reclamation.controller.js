const db = require("../models");
const Reclamation = db.reclamations;
const Notification = db.notification;
const multer = require("multer");
const User = db.user;


const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/productImages");
  },
  filename: function (req, file, cb) {
    const fileName = "test";
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

// ajout reclamation
exports.create = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send("Error uploading image");
    }

    if (!req.body.client) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/productImages/`;

    User.findById(req.body.employee) // Recherche de l'utilisateur par ID
      .then(user => {
        if (!user) {
          // Gérez le cas où l'utilisateur n'est pas trouvé
          return res.status(404).json({ message: 'Employee not found' });
        }

        const reclamation = new Reclamation({
          client: req.body.client,
          type: req.body.type,
          description: req.body.description,
          image: `${basePath}${fileName}`,
          email: req.body.email,
          numero_telephone: req.body.numero_telephone,
          Status: req.body.Status,
          employee: req.body.employee,
          employeeName: user.name // Associez le nom de l'employé récupéré à la propriété employeeName
        });

        reclamation.save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Erreur lors de l'ajout de la réclamation",
            });
          });
      })
      .catch(error => {
        res.status(500).json({ message: 'Failed to find employee', error: error });
      });
  });
};



// liste reclamation
exports.findAll = (req, res) => {
  const client = req.query.client;
  var condition = client ? { client: { $regex: new RegExp(client), $options: "i" } } : {};

  Reclamation.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la récupération des réclamations.."
      });
    });
};


// afiichage reclamation avec id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Reclamation.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found reclamation with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving reclamation with id=" + id });
    });
};

// Update Reclamation avec id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Reclamation.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Reclamation with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Reclamation was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Reclamation with id=" + id
      });
    });
};

// supprimer  Reclamation avec id
exports.delete = (req, res) => {
  const id = req.params.id;

  Reclamation.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Reclamation with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Reclamation was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Reclamation with id=" + id
      });
    });
};

// supprimer listes Reclamations

exports.deleteAll = (req, res) => {
  Reclamation.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Reclamation were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Reclamation."
      });
    });
};

// affichage toutes les reclamtion accepter


exports.findAllPublished = (req, res) => {
  Reclamation.find({ traite: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la récupération des réclamations.."
      });
    });
};

// affichage liste reclamation trier par date de création
exports.findAllSortedByCreationDate = (req, res) => {
  Reclamation.find()
    .sort({ createdAt: 'desc' })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des réclamations."
      });
    });
};

exports.trierReclamations = (req, res) => {
  const champTri = req.params.champTri;
  const ordreTri = req.query.ordre || 'asc';

  let triOptions = {};

  // Vérifiez le champ de tri spécifié et configurez les options de tri en conséquence
  switch (champTri) {
    case 'client':
      triOptions = { client: ordreTri === 'desc' ? -1 : 1 }; // Tri par le champ "client" en fonction de l'ordre spécifié
      break;
    case 'type':
      triOptions = { type: ordreTri === 'desc' ? -1 : 1 }; // Tri par le champ "type" en fonction de l'ordre spécifié
      break;
    case 'traite':
      triOptions = { traite: ordreTri === 'desc' ? -1 : 1 }; // Tri par le champ "publie" en fonction de l'ordre spécifié
      break;
      case 'createdAt':
        triOptions = { createdAt: ordreTri === 'desc' ? -1 : 1 }; // Tri par le champ "type" en fonction de l'ordre spécifié
        break;
      
    // Ajoutez d'autres cas pour les champs supplémentaires que vous souhaitez prendre en charge
    default:
      return res.status(400).send({ message: "Champ de tri invalide !" });
  }

  // Effectuer le tri en utilisant les options de tri
  Reclamation.find().sort(triOptions)
    .then(reclamationsTriees => {
      res.send(reclamationsTriees);
    })
    .catch(error => {
      console.error('Erreur lors du tri des réclamations :', error);
      res.status(500).send({
        message: 'Erreur lors du tri des réclamations.',
      });
    });
};

//statistique reclamation published
exports.statistiqueTraite = (req, res) => {
  Reclamation.aggregate([
    {
      $group: {
        _id: "$traite",
        count: { $sum: 1 }
      }
    }
  ])
    .then(result => {
      let statistiques = {
        traiteTrue: 0,
        traiteFalse: 0
      };

      result.forEach(stat => {
        if (stat._id === true) {
          statistiques.traiteTrue = stat.count;
        } else {
          statistiques.traiteFalse = stat.count;
        }
      });

      res.send(statistiques);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur récupération  statistiques de publication de reclamations."
      });
    });
};

// liste reclamations &&  notifications non lu
exports.findAllreclamationsNot = (req, res) => {
  const client = req.query.client;
  const condition = client
    ? { client: { $regex: new RegExp(client), $options: "i" } }
    : {};

  const reclamationsPromise = Reclamation.find(condition).exec();
  const notificationsPromise = getUnreadNotifications();

  Promise.all([reclamationsPromise, notificationsPromise])
    .then(([reclamations, notifications]) => {
      res.send({ reclamations, notifications });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des réclamations..",
      });
    });
};

// RETURN REPONSE
exports.sendMessage = async (req, res) => {
  const reclamationId = req.params.id;
  const reponse = req.body.reponse_message;
  try {
    let reclamation = await Reclamation.findById(reclamationId);

    if (!reclamation) {
      return res.status(404).json({ success: false, message: 'Réclamation non trouvée.' });
    }
    await reclamation.save();
    res.json({ success: true, message: 'Message enregistré avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l enregistrement du message.' });
  }
};

// notifications non lu
function getUnreadNotifications() {
  return Notification.find({ read: false }).exec();
}
