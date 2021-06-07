const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid === true) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("login fail"));
});

/* 6/5/21 encountered a bug that didn't
  allowed me to sign in, it seems like the bug happened
  because I was using only NUMBERS as passwords for my users
  when registering. After several hours of debbugging I created
  a new user but with a string as a password and everything started 
  working properly.
*/

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Profile not found");
      }
    })

    .catch((err) => res.status(400).json("Error getting user"));
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
