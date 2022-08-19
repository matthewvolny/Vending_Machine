const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const router = require("./router.js");

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.use("/", router);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
