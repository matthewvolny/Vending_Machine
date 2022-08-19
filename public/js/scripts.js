const inventoryDisplay = document.querySelector(".inventory-display");
const coinSlot = document.querySelector(".coin-slot");
const coinDisplay = document.querySelector(".coin-display");

let moneyDeposited = false;

//!move to modules folder
const renderDrinks = (data) => {
  console.log(data);
  const vendingMachineContainer = document.querySelector(
    ".vending-machine-container"
  );
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
    vendingMachineContainer.appendChild(drink);
  });
};

//!move to modules folder
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
      renderDrinks(data);
      return data;
    }
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

getInventory();

coinDisplay.textContent = 0;

//!could be in external module
const sumCoins = async () => {
  console.log("in sum coins");
  try {
    const response = await fetch(`http://localhost:3000/sum`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("coins sum: ", data);
    coinDisplay.textContent = Number(data[0].sum);
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
      body: JSON.stringify({ coin: 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    moneyDeposited = true;
    await sumCoins();
    //!can make the message "1 coin deposited appear on screen"
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};

coinSlot.addEventListener("click", depositCoin);

// //!working here currently
const vendItem = async (item) => {
  console.log("in vend item", item);
  try {
    const response = await fetch(`http://localhost:3000/inventory/${item}`, {
      method: "PUT",
    });
    const data = await response.json();
    console.log(data); //1 drink vended

    return data;
  } catch (error) {
    console.log("Could not retrieve inventory");
  }
};
