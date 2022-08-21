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
  const outputString = `<div>${data.quantity} ${data.drink_name}s remaining.</div><div>Put $ in the coin slot to purchase.</div>`;
  inventoryDisplay.innerHTML = outputString;
};

//get all/specific inventory
const getInventory = async (item) => {
  try {
    if (item) {
      const response = await fetch(`http://localhost:3000/inventory/${item}`, {
        method: "GET",
      });
      const data = await response.json();
      renderQuantityRemaining(data[0]);
      return data;
    } else {
      const response = await fetch("http://localhost:3000/inventory", {
        method: "GET",
      });
      const data = await response.json();
      renderDrinks(data, moneyDeposited);
      return data;
    }
  } catch (error) {
    console.log("cannot retrieve inventory");
  }
};

getInventory();

//!move to modules folder?
const sumCoins = async () => {
  try {
    const response = await fetch(`http://localhost:3000/sum`, {
      method: "GET",
    });
    const data = await response.json();
    coinDisplay.textContent = Number(data[0].sum).toFixed(2);
    return data;
  } catch (error) {
    console.log("cannot retrieve sum");
  }
};

//deposit coin, set money deposited to true
const depositCoin = async () => {
  try {
    const response = await fetch(`http://localhost:3000/`, {
      method: "PUT",
      body: JSON.stringify({ coin: 0.25 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    moneyDeposited = true;
    await sumCoins();
    return response;
  } catch (error) {
    console.log("cannot deposit coin");
  }
};

coinSlot.addEventListener("click", depositCoin);

const renderUserInventory = (drinks) => {
  inventoryDisplay.innerHTML = `<div></div>`;
  drinks.forEach((drink) => {
    inventoryDisplay.innerHTML += `<div class="user-drinks-message">You have ${drink.quantity} ${drink.drink_name}s</div>`;
  });
};

const getUserInventory = async () => {
  try {
    const response = await fetch("http://localhost:3000/user-inventory", {
      method: "GET",
    });
    const data = await response.json();
    renderUserInventory(data);
    return data;
  } catch (error) {
    console.log("cannot retrieve inventory");
  }
};

//vend item to user_inventory
const vendItem = async (item) => {
  try {
    const response = await fetch(`http://localhost:3000/inventory/${item}`, {
      method: "PUT",
    });
    const data = await response.json();
    if (data.quantity) {
      moneyDeposited = false;
      await sumCoins();
      getUserInventory();
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
    await sumCoins();
    return response;
  } catch (error) {
    console.log("could not return change");
  }
};

coinReturn.addEventListener("click", returnChange);
