const inventoryDisplay = document.querySelector(".inventory-display");
const coinSlot = document.querySelector(".coin-slot");
const coinDisplay = document.querySelector(".coin-display");
const coinReturn = document.querySelector(".coin-return");
coinDisplay.textContent = "0.00";
let moneyDeposited = false;

//!move to modules folder?
const renderDrinks = (data) => {
  const items = document.querySelector(".items");
  data.forEach((item) => {
    const drink = document.createElement("div");
    drink.textContent = `${item.drink_name}`;
    const id = "drink" + "-" + item.id.toString();
    drink.setAttribute("id", id);
    drink.onclick = function () {
      if (moneyDeposited) {
        vendItem(item.drink_name);
      } else {
        getInventory(item.drink_name);
      }
    };
    items.appendChild(drink);
  });
};

//!move to modules folder?
const renderQuantityRemaining = (data) => {
  const outputString = `${data.quantity} ${data.drink_name}s remaining`;
  inventoryDisplay.textContent = outputString;
  //!can also have a message like, "pay more to purchase, only 50cents!"
};

//get all remaining inventory
const getInventory = async (item) => {
  console.log(item);
  try {
    if (item) {
      console.log("in if");
      const response = await fetch(`http://localhost:3000/inventory/${item}`, {
        method: "GET",
      });
      const data = await response.json();
      renderQuantityRemaining(data[0]);
      return data;
    } else {
      console.log("in else");
      const response = await fetch("http://localhost:3000/inventory", {
        method: "GET",
      });
      const data = await response.json();
      renderDrinks(data, moneyDeposited);
      return data;
    }
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

getInventory();

//!could be in external module
const sumCoins = async () => {
  console.log("in sum coins");
  try {
    const response = await fetch(`http://localhost:3000/sum`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("coins sum: ", data);
    coinDisplay.textContent = Number(data[0].sum).toFixed(2);
    return data;
  } catch (error) {
    console.log("Could not retrieve sum");
  }
};

//deposit coin, set money deposited to true
const depositCoin = async () => {
  console.log("in deposit coin");
  try {
    const response = await fetch(`http://localhost:3000/`, {
      method: "PUT",
      body: JSON.stringify({ coin: 0.25 /*, moneyDeposited: moneyDeposited*/ }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    //!if error does not come back, 403 or 404 {
    //   moneyDeposited = true;
    // }
    console.log(response.status);
    moneyDeposited = true;
    await sumCoins();
    // !can make the message "1 coin deposited appear on screen"
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

coinSlot.addEventListener("click", depositCoin);

//vend item to user_inventory
const vendItem = async (item) => {
  console.log("in vend item", item);
  try {
    const response = await fetch(`http://localhost:3000/inventory/${item}`, {
      method: "PUT",
    });
    const data = await response.json();
    console.log("logging vend data", data); //1 drink vended

    if (data.status === "200") {
      //!if item vended, set moneyDeposited to false
      moneyDeposited = false;
      //!if insufficient money, do not zero out coins (do not run sum coins?)
      await sumCoins();
    }

    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

const returnChange = async () => {
  try {
    const response = await fetch(`http://localhost:3000/`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    await sumCoins();
    return data;
  } catch (error) {
    console.log("could not return change");
  }
};

coinReturn.addEventListener("click", returnChange);
