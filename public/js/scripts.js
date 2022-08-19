const inventoryButton = document.querySelector(".inventory-button");

const cokeButton = document.querySelector(".coke-button");
const pepsiButton = document.querySelector(".pepsi-button");
const spriteButton = document.querySelector(".sprite-button");
const drPepperButton = document.querySelector(".dr-pepper-button");

const coinSlot = document.querySelector(".coin-slot");

const vendItemButton = document.querySelector(".vend-item-button");

//get all remaining inventory
const getInventory = async (item) => {
  console.log(item);
  try {
    if (item) {
      const response = await fetch(`http://localhost:3000/inventory/${item}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      const response = await fetch("http://localhost:3000/inventory", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

inventoryButton.addEventListener("click", getInventory);

cokeButton.addEventListener("click", (event) => {
  getInventory(event.target.id);
});
pepsiButton.addEventListener("click", (event) => {
  getInventory(event.target.id);
});
spriteButton.addEventListener("click", (event) => {
  getInventory(event.target.id);
});
drPepperButton.addEventListener("click", (event) => {
  getInventory(event.target.id);
});

const depositCoin = async () => {
  console.log("in deposit coin");
  try {
    const response = await fetch(`http://localhost:3000/`, {
      method: "PUT",
      body: JSON.stringify({ coin: 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

coinSlot.addEventListener("click", depositCoin);

//may want to keep state
let totalFunds = {
  coinsDeposited: 0,
  drinkSelection: "",
};

//!working here currently
const vendItem = async () => {
  //!takes drink selection, and amount of money
  console.log("in vend item");
  try {
    const response = await fetch(`http://localhost:3000/`, {
      method: "PUT",
      body: JSON.stringify({ coin: 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

vendItemButton.addEventListener("click", vendItem);
