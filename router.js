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

//retrieve all inventory
router.get("/inventory", async (req, res) => {
  console.log("in inventory");
  try {
    const allInventory = await database.any("SELECT * FROM machine_inventory");
    res.status(200).send(allInventory);
  } catch (error) {
    console.log("sorry, no inventory found");
  }
});

//retrieve specific inventory
router.get("/inventory/:item", async (req, res) => {
  console.log("in get /inventory/:item");
  try {
    const drinkData = await database.any(
      `SELECT * FROM machine_inventory WHERE drink_name = '${req.params.item}'`
    );
    res.status(200).send(drinkData);
  } catch (error) {
    console.log("sorry, no inventory found");
  }
});

//deposit coins
router.put("/", async (req, res) => {
  console.log("in deposit coin put");
  const coin = req.body.coin;
  try {
    const balance = await database.any("SELECT * FROM deposit");
    let updatedBalance = Number(balance[0].balance) + Number(coin);
    let queryString = `UPDATE deposit SET balance = ($1) WHERE coin_type = ($2)`;
    await database.none(queryString, [updatedBalance, "quarter"]);
    res.json({ message: ".25 cents deposited" });
  } catch (error) {
    console.log("sorry, cannot accept coin");
  }
});

// //middleware to determine if there is already a coin inserted
// router.use("/", async (req, res, next) => {
//   console.log("in middleware - check for coin");
//   try {
//     const sum = await database.any(`SELECT * FROM deposit`);
//     coinTotal = sum[0].sum;
//     console.log(coinTotal);
//     if (coinTotal < 2) {
//       res
//         .status(403)
//         .json({
//           message:
//             "Insufficient funds.  Add more $ or click coin return button",
//         })
//         .end();
//     } else {
//       res.locals.difference = coinTotal - 2;
//     }
//   } catch (error) {
//     console.log("sorry,stuck in middleware - get change");
//   }
//   next();
// });

//retrieve total coins
router.get("/sum", async (req, res) => {
  console.log("in totalCoins");
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum;
    console.log(sum);
    res.status(200).send(coinTotal);
  } catch (error) {
    console.log("sorry, no coins were deposited");
  }
});

//middleware to get number of coins before knowing if you can vend (can be used in various places)
router.use("/inventory/:item", async (req, res, next) => {
  console.log("in middleware - get change");
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum[0].sum;
    console.log(coinTotal);
    if (coinTotal < 0.5) {
      res.status(403).json({
        message: "Insufficient funds.  Add more $ or click coin return button",
        status: "403",
      });
      res.locals.insufficientFunds = true;
      // .end();
    } else {
      res.locals.difference = coinTotal - 0.5;
      // next();
    }
  } catch (error) {
    console.log("sorry,stuck in middleware - get change");
  }
  next();
});

//middleware to get remaining drinks
router.use("/inventory/:item", async (req, res, next) => {
  console.log("in middleware - get remaining drinks");
  try {
    const drink = await database.any(
      `SELECT * FROM machine_inventory WHERE drink_name = '${req.params.item}'`
    );
    console.log("drink quantity:", drink[0].quantity);
    const drinkQuantity = drink[0].quantity;
    if (drinkQuantity < 1) {
      res.status(404).json({
        message: "Drink is out of stock.  Make another selection",
      });
      res.locals.unavailableSupply = true;
      // .end();
    } else {
      res.locals.remainingItem = drinkQuantity - 1;
      next();
    }
  } catch (error) {
    console.log("sorry,stuck in middleware - get change");
  }
  // next();
});

//vend item, return excess coins, report remaining drinks
router.put("/inventory/:item", async (req, res) => {
  console.log("in vend put");
  const drink = req.params.item;
  console.log(drink);
  try {
    if (res.locals.insufficientFunds || res.locals.unavailableSupply) {
      res.json({
        sufficientFunds: res.locals.sufficientFunds,
        availableSupply: res.locals.availableSupply,
      });
    } else {
      //add drink to user_inventory
      let queryString =
        "INSERT INTO user_inventory (drink_name, quantity) VALUES ($1, $2)";
      await database.none(queryString, [drink, 1]);

      //update machine_inventory
      let queryString2 = `UPDATE machine_inventory SET quantity = ${res.locals.remainingItem} WHERE drink_name = ($1)`;
      await database.none(queryString2, [drink]);

      //set machine_inventory balance to 0
      let queryString3 = `UPDATE deposit SET balance = ($1) WHERE coin_type = ($2)`;
      await database.none(queryString3, [0, "quarter"]);

      //!want to return header here that says
      res.json({
        message: `1 ${drink} vended`,
        message2: `change is ${res.locals.difference}`,
        message3: `${res.locals.remainingItem} ${drink}s remaining`,
        status: "200",
      });
    }
  } catch (error) {
    console.log("sorry, system error");
  }
});

//dispense change
router.delete("/", async (req, res) => {
  console.log("in delete");
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum[0].sum;
    console.log(coinTotal);
    if (Number(coinTotal) === 0) {
      res.json({ message: `no change to give` });
    } else {
      //delete supply of coins
      let queryString = `DELETE FROM deposit WHERE coin_type=($1)`;
      await database.none(queryString, "quarter");
      //set machine_inventory balance to 0
      let queryString1 =
        "INSERT INTO deposit (coin_type, balance) VALUES ($1, $2)";
      await database.none(queryString1, ["quarter", 0]);
      //!want to return header here that says
      res.json({ message: `change is ${coinTotal}` });
    }
  } catch (error) {
    console.log("sorry, could not return change in router");
  }
});

module.exports = router;
