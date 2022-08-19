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

//retrieve total coins
router.get("/sum", async (req, res) => {
  console.log("in totalCoins");

  try {
    const sum = await database.any(`SELECT SUM(coins) FROM coins_deposited`);
    coinTotal = sum;
    console.log(sum);
    res.status(200).send(coinTotal);
  } catch (error) {
    console.log("sorry, no coins were deposited");
  }
});

//retrieve all inventory
router.get("/inventory", async (req, res) => {
  console.log("in get /inventory");
  try {
    const userInfo = await database.any("SELECT * FROM inventory");
    console.log(userInfo);
    res.status(200).send(userInfo);
  } catch (error) {
    console.log("sorry, no inventory found");
  }
});

//retrieve specific inventory
router.get("/inventory/:item", async (req, res) => {
  console.log("in get /inventory/:item");
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

//middleware to get number of coins before knowing if you can vend (can be used in various places)
router.use("/inventory/:item", async (req, res, next) => {
  console.log("in middleware - get change");
  //!need following line for when there is no money deposited
  // if (moneyDeposited) {
  if (true) {
    try {
      const sum = await database.any(`SELECT SUM(coins) FROM coins_deposited`);
      coinTotal = sum[0].sum;
      console.log(coinTotal);
      res.locals.difference = coinTotal - 2;
    } catch (error) {
      console.log("sorry,stuck in middleware - get change");
    }
  }
  next();
});

//vend item and return excess coins
router.put("/inventory/:item", async (req, res) => {
  if (res.locals.difference) {
    console.log("difference from middleware", res.locals.difference);
  }
  console.log("in vend put");
  console.log(req.params.item);
  const drink = req.params.item;
  console.log(drink);
  try {
    let queryString =
      "INSERT INTO vended (drink_name, quantity) VALUES ($1, $2)";
    await database.none(queryString, [drink, 1]);
    //!want to return header here that says
    //! believe i need middleware for this
    //1) X of coins returned, delete request (delete request, remove all coins)
    //2) current inventory of the chose drink remaining (get request, remaining drink of the vended type)
    res.json({ message: `1 ${drink} vended` });
  } catch (error) {
    console.log("sorry, cannot accept coin");
  }
});

module.exports = router;
