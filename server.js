const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const loadedtransactions = require("./controllers/loadedtransactions");
const transactions = require("./controllers/transactions");

const db = knex({
  client: "pg",
  connection: {
    host: "postgresql-encircled-01739",
    user: "postgres",
    password: "789456",
    database: "badb",
  },
});

db.select("*")
  .from("users")
  .then((data) => {});

db.select("*")
  .from("movements")
  .then((data) => {});

db.select("*")
  .from("login")
  .then((data) => {});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => {
  signin.signInHandler(req, res, db, bcrypt);
});

/* 6/5/21 encountered a bug that didn't
  allowed me to sign in, it seems like the bug happened
  because I was using only NUMBERS as passwords for my users
  when registering. After several hours of debbugging I created
  a new user but with a string as a password and everything started 
  working properly.
*/

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.profileHandler(req, res, db);
});

app.put("/loadedtransactions", (req, res) => {
  loadedtransactions.loadedtransactionsHandler(req, res, db);
});

app.put("/transactions", (req, res) => {
  transactions.transactionHandler(req, res, db);
});

//add environmental variable to port3000

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
