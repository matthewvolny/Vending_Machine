const express = require("express");
const router = express.Router();
const pgPromise = require("pg-promise")();

const config = {
  host: "localhost",
  port: 5432,
  database: "vending_machine",
  user: "", //set by user
  password: "", //set by user
};

const database = pgPromise(config);

//serve home page
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});

//retrieve all inventory
router.get("/inventory", async (req, res) => {
  try {
    const allInventory = await database.any("SELECT * FROM machine_inventory");
    res.status(200).send(allInventory);
  } catch (error) {
    console.log("no inventory found");
  }
});

//retrieve specific inventory
router.get("/inventory/:item", async (req, res) => {
  try {
    const drinkData = await database.any(
      `SELECT * FROM machine_inventory WHERE drink_name = '${req.params.item}'`
    );
    res.status(200).send(drinkData);
  } catch (error) {
    console.log("no specific inventory found");
  }
});

//deposit coins
router.put("/", async (req, res) => {
  const coin = req.body.coin;
  console.log("coin:", coin);
  try {
    const balance = await database.any("SELECT * FROM deposit");
    let updatedBalance = Number(balance[0].balance) + Number(coin);
    console.log("updatedBalance:", updatedBalance);
    let queryString = `UPDATE deposit SET balance = ($1) WHERE coin_type = ($2)`;
    await database.none(queryString, [updatedBalance, "quarter"]);
    res.status(204).set({ "X-Coins": "1 quarter accepted" }).send();
  } catch (error) {
    console.log("sorry, cannot accept coin");
  }
});

//retrieve total coins
router.get("/sum", async (req, res) => {
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum;
    res.status(200).send(coinTotal);
  } catch (error) {
    console.log("no coins currently deposited");
  }
});

//middleware: test of sufficient funds
router.use("/inventory/:item", async (req, res, next) => {
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum[0].sum;
    if (coinTotal < 0.5) {
      res
        .status(403)
        .set({ "X-Coins": "Insufficient Funds" })
        .json({ message: "middleware caught insufficient funds" });
    } else {
      res.locals.difference = coinTotal - 0.5;
      next();
    }
  } catch (error) {
    console.log("cannot retrieve balance");
  }
});

//middleware: test of sufficient inventory
router.use("/inventory/:item", async (req, res, next) => {
  try {
    const drink = await database.any(
      `SELECT * FROM machine_inventory WHERE drink_name = '${req.params.item}'`
    );
    console.log("drink quantity:", drink[0].quantity);
    const drinkQuantity = drink[0].quantity;
    if (drinkQuantity < 1) {
      res
        .status(404)
        .set({ "X-Inventory-Remaining": `${drinkQuantity} drinks left` })
        .json({ message: "insufficient supply" });
    } else {
      res.locals.remainingItem = drinkQuantity - 1;
      next();
    }
  } catch (error) {
    console.log("cannot retrieve specific inventory");
  }
});

//vend item and return excess coins
router.put("/inventory/:item", async (req, res) => {
  const drink = req.params.item;
  try {
    const userDrinkQuantity = await database.any(
      `SELECT quantity FROM user_inventory WHERE drink_name = '${drink}'`
    );
    const userHeldDrinks = userDrinkQuantity[0].quantity + 1;
    let queryString =
      "Update user_inventory SET quantity = ($1) WHERE drink_name = ($2)";
    await database.none(queryString, [userHeldDrinks, drink]);
    let queryString2 = `UPDATE machine_inventory SET quantity = ${res.locals.remainingItem} WHERE drink_name = ($1)`;
    await database.none(queryString2, [drink]);
    let queryString3 = `UPDATE deposit SET balance = ($1) WHERE coin_type = ($2)`;
    await database.none(queryString3, [0, "quarter"]);
    res
      .status(200)
      .set({
        "X-Coins": `change is ${res.locals.difference}`,
        "X-Inventory-Remaining": `${res.locals.remainingItem} ${drink}s remaining`,
      })
      .send({ quantity: `1 ${drink} vended` });
  } catch (error) {
    console.log(
      "complex error: cannot vend item, set machine inventory, or reset balance"
    );
  }
});

//retrieve user inventory
router.get("/user-inventory", async (req, res) => {
  try {
    const allInventory = await database.any("SELECT * FROM user_inventory");
    res.status(200).send(allInventory);
  } catch (error) {
    console.log("no inventory found");
  }
});

//dispense change
router.delete("/", async (req, res) => {
  try {
    const sum = await database.any(`SELECT SUM(balance) FROM deposit`);
    coinTotal = sum[0].sum;
    if (Number(coinTotal) === 0) {
      res.json({ message: `no change to give` });
    } else {
      let queryString = `DELETE FROM deposit WHERE coin_type=($1)`;
      await database.none(queryString, "quarter");
      let queryString1 =
        "INSERT INTO deposit (coin_type, balance) VALUES ($1, $2)";
      await database.none(queryString1, ["quarter", 0]);
      res
        .status(204)
        .set({ "X-Coins": `$${coinTotal} returned` })
        .send();
    }
  } catch (error) {
    console.log("cannot return change");
  }
});

module.exports = router;
