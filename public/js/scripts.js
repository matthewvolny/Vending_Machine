const inventoryButton = document.querySelector(".inventory-button");
const cokeButton = document.querySelector(".coke-button");
const pepsiButton = document.querySelector(".pepsi-button");
const spriteButton = document.querySelector(".sprite-button");
const drPepperButton = document.querySelector(".dr-pepper-button");

//get all remaining inventory
const getInventory = async (item) => {
  console.log(item);
  try {
    if (item) {
      const response = await fetch(`http://localhost:3000/inventory/${item}`, {
        method: "GET",
        // headers: {
        //   "x-rapidapi-host": "carbonfootprint1.p.rapidapi.com",
        //   "x-rapidapi-key": "your_api_key",
        // },
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

const pickDrink = async () => {
  try {
    const fetchResponse = await fetch("http://localhost:3000/inventory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await fetchResponse.json();
    return data;
  } catch (e) {
    return e;
  }
};
