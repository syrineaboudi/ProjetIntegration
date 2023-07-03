const db = require("../models");
const Reponse = db.reponses;
const Reclamation = db.reclamations;

var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'khalil.guedoir@esprit.tn',
        pass: 'vdnwxuctswpuvjlq',
    },
    secure: true,
});

// Correction du contrôleur

exports.sendEmail = (req, res) => {
  const reclamationId = req.body.reclamation; // Utilisation de req.body.reclamation pour récupérer l'ID de réclamation depuis le corps de la requête

  // Rechercher la réclamation par son ID
  Reclamation.findById(reclamationId)
    .then((reclamation) => {
      if (!reclamation) {
        return res.status(404).json({ message: 'Réclamation non trouvée.' });
      }

      // Récupérer l'e-mail enregistré dans la réclamation
      const recipientEmail = reclamation.email;

      // Vérifier si l'e-mail du destinataire est disponible
      if (!recipientEmail) {
        return res.status(400).json({ message: "L'e-mail du destinataire n'est pas disponible." });
      }

      // Configurer les données de l'e-mail
      const mailOptions = {
        from: 'khalil.guedoir@esprit.tn',
        to: recipientEmail,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.text
      };

      // Envoyer l'e-mail
      transporter.sendMail(mailOptions)
        .then(() => {
          res.status(200).json({ message: 'E-mail envoyé avec succès.' });
        })
        .catch((error) => {
          console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
          res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
        });
    })
    .catch((error) => {
      console.log('Erreur lors de la recherche de la réclamation:', error);
      res.status(500).json({ message: 'Erreur lors de la recherche de la réclamation.' });
    });
};

exports.send = (req, res) => {
  const mailData = {
    from: 'khalil.guedoir@esprit.tn',
    to: req.body.reclamation.email,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.text
  };

  transporter.sendMail(mailData)
    .then((info) => {
      const reponse = new Reponse({
        reclamation: req.body.reclamation._id,
        id_user: req.body.id_user,
        subject: req.body.subject,
        text: req.body.text
      });

      return reponse.save();
    })
    .then(() => {
      res.status(200).json({ message: 'E-mail envoyé et données enregistrées.' });
    })
    .catch((error) => {
      console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
    });
};
