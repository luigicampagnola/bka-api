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

const database = {
  users: [
    {
      id: "123",
      name: "Admin",
      email: "admin@gmail.com",
      password: "123",
      joined: new Date(),
    },
    {
      id: "124",
      name: "carl",
      email: "carl@gmail.com",
      password: "1234",
      joined: new Date(),
      movements: [
        {
          id: 0,
          Type: "Withdrawal",
          Date: "05/23/2021 at 17:11",
          Amount: 0,
        },
      ],
    },
  ],
  movementsTable: [
    {
      id: "123",
      Type: "Deposit",
      Date: "13/03.1991",
      Amount: 100,
    },
    {
      id: "123",
      Type: "Withdrawal",
      Date: "13/03.1991",
      Amount: 50,
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "admin@gmail.com",
    },
  ],
};

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
      console.log(data);
    });
});

app.put("/transactions", (req, res) => {
  const { id, email, type, date, amount, movements } = req.body;
  console.log(id, email, type, date, amount);
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
        console.log(data);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
  /*   db.select("email")
    .from("movements")
    .where("email", "=", email)
    .insert({
      type: type,
      date: date,
      amount: amount,
      email: email,
    })
    .into("movements")
    .then((data) => {
      console.log(data);
      res.json(data);
    });
 */
  /*   let found = false;
  database.users.forEach((user) => {
    if (user.id === id && database.movementsTable[0].id === id) {
      found = true;
      database.movementsTable.push(movements);
      return res.json(database.movementsTable);
    }
  });

  if (!found) {
    res.status(400).json("not found");
  } */
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
