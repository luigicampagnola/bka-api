const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./contollers/register");
const signin = require("./contollers/signin");
const profile = require("./contollers/profile");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
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
  const { email } = req.body;

  db.select("*")
    .from("movements")
    .where("email", "=", email)
    .then((data) => {
      res.json(data);
    });
});

app.put("/transactions", (req, res) => {
  const { email, type, date, amount } = req.body;
  db.transaction((trx) => {
    trx
      .insert({
        type: type,
        date: date,
        amount: amount,
        email: email,
      })
      .into("movements")
      .returning("*")
      .then((data) => {
        res.json(data);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
