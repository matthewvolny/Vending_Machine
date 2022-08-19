const express = require("express");
const app = express();
const router = express.Router();
const pgPromise = require("pg-promise")();

const config = {
  host: "suleiman.db.elephantsql.com",
  port: 5432,
  database: "bwmffvjw",
  user: "bwmffvjw",
  password: "tKdEwDWKgjIgOqdkIfA06FrvJ3_xOXcJ",
};

const database = pgPromise(config);

//serve home page
router.get("/", (req, res) => {
  console.log("serving home.html");
  res.sendFile(__dirname + "/public/home.html");
});

//deposit coins
router.put("/", async (req, res) => {
  console.log("in deposit coin put");
  const coin = req.body.coin;
  try {
    let queryString = "INSERT INTO coins_deposited (coins) VALUES ($1)";
    await database.none(queryString, [coin]);
    res.json({ message: "1 coin deposited" });
    //!may want to redirect here to display total number of coins inserted, another get req
  } catch (error) {
    console.log("sorry, cannot accept coin");
  }
});

//retrieve all inventory
router.get("/inventory", async (req, res) => {
  console.log("in get /inventory");
  try {
    const userInfo = await database.any(`SELECT * FROM inventory`);
    console.log(userInfo);
    res.status(200).send(userInfo);
  } catch (error) {
    console.log("sorry, no inventory found");
  }
});

//retrieve specific inventory
router.get("/inventory/:item", async (req, res) => {
  console.log("in get /inventory");
  try {
    const userInfo = await database.any(
      `SELECT * FROM inventory WHERE drink_name = '${req.params.item}'`
    );
    console.log(userInfo);
    res.status(200).send(userInfo);
  } catch (error) {
    console.log("sorry, no inventory found");
  }
});

//vend item and return excess coins
router.put("/inventory/:item", async (req, res) => {
  console.log("in deposit coin put");
  const coin = req.body.coin;
  try {
    let queryString = "INSERT INTO coins_deposited (coins) VALUES ($1)";
    await database.none(queryString, [coin]);
    res.json({ message: "1 coin deposited" });
    //!may want to redirect here to display total number of coins inserted, another get req
  } catch (error) {
    console.log("sorry, cannot accept coin");
  }
});

module.exports = router;
