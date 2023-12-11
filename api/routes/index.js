var express = require("express");
var router = express.Router();
var hal = require("../hal");
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
    res.json(users);
    //res.render("index", { title: "Home", users: users });
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

    const users = rows.map((element) => {
      return {
        artistName: element.artiste_concert,
      };
    });
    res.json(users)
    //res.render("artist", { title: "Artists", users: users });
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

    const resourceObject = {
      "_links": {
          "self" : hal.halLinkObject('/concerts')
      },
      "_embedded": {
          "concerts": rows.map(row => hal.mapConcertToResourceObject(row, req.baseUrl))
      },
      "nbConcerts": rows.length
    };

    res.set('Content-type', 'application/hal+json');
    res.status(200);
    res.json(resourceObject);
    //res.render("concerts", { title: "Concerts", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// Les informations d’un concert
router.get("/concerts/:idConcert([0-9]+)", async (req, res) => {
  const idConcert = 1;
  if (typeof req.params.idConcert === "int") {
    idConcert = req.params.idConcert;
  }

  const conn = await db.mysql.createConnection(db.dsn);
  try {
    const [rows] = await conn.execute("SELECT * FROM Concert WHERE id = ?;", [
      idConcert,
    ]);

    const users = rows.map((element) => {
      return {
        dateConcert: element.date_heure_concert,
        artistName: element.artiste_concert,
        styleConcert: element.style_concert,
        lieuConcert: element.lieu_concert,
        nbPlaces: element.nb_place_concert,
      };
    });

    res.json(users);
    //res.render("concertParId", { title: "Concert", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// La liste des réservations d’un concert --> Gestionnaire only
router.get("/concerts/:idConcert([0-9]+)/reservation", async (req, res) => {
  const idConcert = req.params.idConcert;

  const conn = await db.mysql.createConnection(db.dsn);
  try {
    const [rows] = await conn.execute(
      "SELECT * FROM Reservation WHERE id_concert = ?;",
      [idConcert]
    );
    console.log("rows :>> ", rows);
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
    res.json(users);
    //res.render("concertParId", { title: "Concert", users: users });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).render("error", {
      message:
        "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

// Confirmer ou annuler une réservation
router.put(
  "/concerts/:idConcert([0-9]+)/reservation/:idReservation([0-9]+)",
  async (req, res) => {
    const idConcert = req.params.idConcert;
    const idReservation = req.params.idReservation;
    const updateTo = "to_confirm";
    if(req.headers.updateTo === "cancelled" || req.headers.updateTo === "confirmed"){
      updateTo = req.headers.updateTo;
    };
    console.log('updateTo :>> ', updateTo);
    const args = [updateTo,idConcert, idReservation];

    const conn = await db.mysql.createConnection(db.dsn);
    try {
      const [rows] = await conn.execute(
        "UPDATE Reservation SET status = '?' WHERE id = ? AND id_concert = ?;",
        args
      );
      console.log("rows :>> ", rows);
      
    } catch (error) {
      console.error("Error connecting: " + error.stack);
      res.status(500).render("error", {
        message:
          "Nous rencontrons des difficultés, merci de réessayer plus tard.",
      });
    }
  }
);

module.exports = router;
