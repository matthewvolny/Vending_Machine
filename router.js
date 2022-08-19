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

// define the home page route
router.get("/", (req, res) => {
  console.log("hola");
  res.sendFile(__dirname + "/public/home.html");
});

//retrieve user game on login
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

// router.post("/", (req, res) => {
//   console.log("post to /");
//   console.log(req.params);
//   console.log(req.body);
//   console.log(req.url);
//   console.log(req.query);
//   res.sendFile(__dirname + "/public/home.html");
// });

// define the about route
router.get("/alternate", (req, res) => {
  console.log("in alternate");
  console.log(req.params);
  console.log(req.body);
  console.log(req.url);
  console.log(req.query);
  res.sendFile(__dirname + "/public/alternate.html");
});

app.use(express.static("public"));

// router.get("/", async (req, res) => {
//   try {
//     res.send("alternative.html");
//     console.log(req.params);
//     console.log(req.body);
//     console.log(req.url);
//     console.log(req.query);
//     res.send(req.params);
//     // res.render("home", {
//     //   loggedInUser: loggedInUser,
//     //   contactInfo: [],
//     //   messages: [],
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/users/:userId/books/:bookId", async (req, res) => {
//   try {
//     res.sendFile("index.html");
//     // res.render("home", {
//     //   loggedInUser: loggedInUser,
//     //   contactInfo: [],
//     //   messages: [],
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
//else means that you have logged in before and have some contacts,  and messages stored
//   } else {
//     try {
//       const combinedTables = await database.any(
//         `SELECT * FROM users NATURAL JOIN rooms`
//       );

//       let myRooms = [];
//       for (let i = 0; i < combinedTables.length; i++) {
//         if (combinedTables[i].id === loggedInUser[0].id) {
//           myRooms.push(combinedTables[i].room_id);
//         }

//       console.log(myRooms);

//       let otherUsersRooms = [];
//       for (let i = 0; i < combinedTables.length; i++) {
//         if (combinedTables[i].id !== loggedInUser[0].id) {
//           otherUsersRooms.push(combinedTables[i].room_id);
//         }
//       }

//       console.log(otherUsersRooms);

//       let sharedRooms = [];
//       for (let i = 0; i < otherUsersRooms.length; i++) {
//         for (let j = 0; j < myRooms.length; j++) {
//           if (otherUsersRooms[i] === myRooms[j]) {
//             sharedRooms.push(otherUsersRooms[i]);
//           }
//         }
//       }
//       console.log(sharedRooms);
//       //remove duplicates from shared rooms array

//       let sharedRoomsSet = [...new Set(sharedRooms)];
//       newSharedRooms = Array.from(sharedRoomsSet);
//       console.log(newSharedRooms);

//       let contactInfo = [];
//       for (let i = 0; i < combinedTables.length; i++) {
//         for (let j = 0; j < newSharedRooms.length; j++) {
//           if (
//             combinedTables[i].room_id === newSharedRooms[j] &&
//             combinedTables[i].id !== loggedInUser[0].id
//           ) {
//             contactInfo.push(combinedTables[i]);
//           }
//         }
//       }

//       console.log(contactInfo);
//       //

//       //search database for all messages for the joined room
//       console.log(`joined room ${joinedRoom}`);
//       //check if user has messages in a particular room
//       const messagesFromSpecificRoom = await database.any(
//         `SELECT * FROM users NATURAL JOIN messages WHERE room_id = '${joinedRoom}'`
//       );

//       if (messagesFromSpecificRoom) {
//         //can build the array or object I want with these messages here
//         let messagesPromise = [];
//         for (let i = 0; i < messagesFromSpecificRoom.length; i++) {
//           messagesPromise.push({
//             username: messagesFromSpecificRoom[i].username,
//             message: messagesFromSpecificRoom[i].message_content,
//             date: messagesFromSpecificRoom[i].created_at,
//           });
//         }

//         let resolvedArray = Promise.resolve(messagesPromise);
//         resolvedArray.then(function (messages) {
//           console.log(messages);
//           console.log("in if line 106");
//           res.render("home", {
//             loggedInUser: loggedInUser,
//             contactInfo: contactInfo,
//             messages: messages,
//           });
//         });
//       } else {
//         console.log("in else line 113");
//         res.render("home", {
//           loggedInUser: loggedInUser,
//           contactInfo: contactInfo,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// });

// router.post("/storeMessage", async (req, res) => {
//   const id = req.body.id,
//     msg = req.body.msg,
//     postDate = req.body.post_date,
//     roomId = req.body.room_Id;
//   // console.log(`id: ${id}`);
//   // console.log(`msg: ${msg}`);
//   // console.log(`post_date: ${post_date}`);
//   try {
//     let queryString =
//       "INSERT INTO messages (id, message_content, room_id) VALUES ($1, $2, $3)";
//     await database.none(queryString, [id, msg, roomId]);
//     //could redirect to another page for a moment (confirming registration, then redirect to /login)
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/login", async (req, res) => {
//   try {
//     //!db call stored as a variable then sent out to render page
//     res.render("login");
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/signup", async (req, res) => {
//   try {
//     res.render("signup");
//   } catch (error) {
//     console.log(error);
//   }
// });

// //checks db for username and password and redirects to the home page
// router.post("/login", async (req, res) => {
//   const username = req.body.username,
//     password = req.body.password;
//   try {
//     const loginAttempt = await database.any(
//       `SELECT * FROM users WHERE username = '${username}' AND user_password = '${password}'`
//     );
//     if (loginAttempt) {
//       // console.log(loginAttempt[0].id);
//       // console.log(loginAttempt[0].username);
//       // console.log(loginAttempt[0].user_password);
//       // console.log(loginAttempt[0].email);
//       loggedInUser = loginAttempt;
//       res.redirect("/");
//     }
//   } catch (error) {
//     console.log(`sorry password not found, ${error}`);
//   }
// });

// //create user
// router.post("/signup", async (req, res) => {
//   const username = req.body.username,
//     password = req.body.password,
//     email = req.body.email,
//     src = req.body.src;
//   console.log(`src ${src}`); //coming up null
//   try {
//     let queryString =
//       "INSERT INTO users (username, user_password, email, src) VALUES ($1, $2, $3, $4)";
//     await database.none(queryString, [username, password, email, src]);
//     //could redirect to another page for a moment (confirming registration, then redirect to /login)
//     res.redirect("/login");
//   } catch (error) {
//     console.log(error);
//   }
// });

// //add invite roomId code to the database
// router.post("/invite", async (req, res) => {
//   const userId = req.body.userId,
//     inviteCode = req.body.inviteCode;
//   // console.log(`line 130 ${req.body.userId}`);
//   // console.log(`line 132 ${req.body.inviteCode}`);
//   try {
//     let queryString = "INSERT INTO rooms (id, room_id) VALUES ($1, $2)";
//     await database.none(queryString, [userId, inviteCode]);
//     // res.redirect("/");
//   } catch (error) {
//     console.log(error);
//   }
// });

// //add invite roomId code to the database
// router.post("/pastedInvite", async (req, res) => {
//   const userId = req.body.userId,
//     pastedRoomId = req.body.pastedRoomId;
//   // console.log(`line 130 ${userId}`);
//   // console.log(`line 132 ${pastedRoomId}`);
//   try {
//     let queryString = "INSERT INTO rooms (id, room_id) VALUES ($1, $2)";
//     await database.none(queryString, [userId, pastedRoomId]);
//     res.redirect("/");
//   } catch (error) {
//     console.log(error);
//   }
// });

// //checks db for username and password and redirects to the home page
// router.post("/logRoomId", (req, res) => {
//   joinedRoom = req.body.roomId;
//   console.log(`req body roomid ${joinedRoom}`);
//   // res.redirect("/");
// });
