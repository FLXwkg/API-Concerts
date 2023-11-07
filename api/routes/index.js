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
        firstName: element.first_name,
      };
    });
    res.render("index", { title: "RESTful web api", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res
      .status(500)
      .json({
        msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
      });
  }
});

// La liste de tous les artistes en concert
router.get("/artists", async (req, res) => {
  console.log("users :>> ", rows);
});

// La liste des concerts
router.get("/concerts", async (req, res) => {
  res.sendFile(__dirname + "/public/concerts.html");
});

// Les informations d’un concert
router.get("/concerts/:idConcert", async (req, res) => {
  const idConcert = req.params.idConcert;
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
