var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // #swagger.summary = "Page d'accueil"
  const conn = await db.mysql.createConnection(db.dsn);

  try {
    const [rows] = await conn.execute("SELECT * FROM User");

    const users = rows.map((element) => {
      return {
        userName: element.user_name,
        userRole: element.is_admin,
      };
    });
    res.render("index", { title: "Home", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// La liste de tous les artistes en concert
router.get("/artists", async (req, res) => {
  const conn = await db.mysql.createConnection(db.dsn);
  try {
    const [rows] = await conn.execute("SELECT * FROM Concert;");

    console.log("rows :>> ", rows);
    const users = rows.map((element) => {
      return {
        artistName: element.artiste_concert,
      };
    });
    res.render("artist", { title: "Artists", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// La liste des concerts
router.get("/concerts", async (req, res) => {
  const conn = await db.mysql.createConnection(db.dsn);
  try {
    const [rows] = await conn.execute("SELECT * FROM Concert;");
    console.log('rows :>> ', rows);
    const users = rows.map((element) => {
      return {
        dateConcert: element.date_heure_concert,
        artistName: element.artiste_concert,
        styleConcert: element.style_concert,
        lieuConcert: element.lieu_concert,
        nbPlaces: element.nb_place_concert,
      };
    });
    console.log("users :>> ", users);
    res.render("concerts", { title: "Concerts", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// Les informations d’un concert
router.get("/concerts/:idConcert", async (req, res) => {
  const idConcert = req.params.idConcert;

  const conn = await db.mysql.createConnection(db.dsn);
  try {
    const [rows] = await conn.execute("SELECT * FROM Concert WHERE id = ?;", idConcert);
    console.log('rows :>> ', rows);
    const users = rows.map((element) => {
      return {
        dateConcert: element.date_heure_concert,
        artistName: element.artiste_concert,
        styleConcert: element.style_concert,
        lieuConcert: element.lieu_concert,
        nbPlaces: element.nb_place_concert,
      };
    });
    console.log("users :>> ", users);
    res.render("concertParId", { title: "Concerts", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// La liste des réservations d’un concert --> Gestionnaire only
router.get("/concerts/:idConcert/reservation", async (req, res) => {
  const idConcert = req.params.idConcert;
});

// Confirmer ou annuler une réservation
router.put(
  "/concerts/:idConcert/reservation/:idReservation",
  async (req, res) => {
    const idConcert = req.params.idConcert;
    const idReservation = req.params.idReservation;
  }
);

module.exports = router;
