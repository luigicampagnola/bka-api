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
  .then((data) => {
    console.log(data);
  });

db.select("*")
  .from("movements")
  .then((data) => {
    console.log(data);
  });

const database = {
  users: [
    {
      id: "123",
      name: "Admin",
      email: "admin@gmail.com",
      password: "123",
      joined: new Date(),
      movements: [
        {
          id: 1,
          Type: "",
          Date: "",
          Amount: 0,
        },
      ],
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
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "123456",
    "$2a$10$x81NHeyZwkeWkB1NZ14os.yEJq0sMq.CcDT/z8Z0809Lx9iGezBSm",
    function (err, res) {}
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$x81NHeyZwkeWkB1NZ14os.yEJq0sMq.CcDT/z8Z0809Lx9iGezBSm",
    function (err, res) {}
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0] /* , database.movementsTable */);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {});
  /*     db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to register")); */
  database.users.push({
    id: "125",
    name: name,
    email: email,
    joined: new Date(),
    transactions: {
      movements: [
        {
          id: 15,
          Type: "Deposit",
          Date: "01/02/21",
          Amount: 10,
        },
      ],
    },
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.put("/loadedTransactions", (req, res) => {
  const { id } = req.body;
  database.users.forEach((user) => {
    if (user.id === id && database.movementsTable[0].id === id) {
      return res.json(database.movementsTable);
    }
  });
});

app.put("/transactions", (req, res) => {
  const { id, movements } = req.body;
  /*   db.select("id").from("movements")
  .where("id", "=", id)
  .update(movements)
  .returning(movements)
  .then(move=>{
    console.log(move)
  })  */
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id && database.movementsTable[0].id === id) {
      found = true;
      database.movementsTable.push(movements);
      return res.json(database.movementsTable);
    }
  });
  /*   database.users.forEach((user) => {
    if (user.id === id && user.movements.id === id) {
      found = true;
      database.users[0].movements.push(movements);
      return res.json(user.movements);
    }
  }); */
  if (!found) {
    res.status(400).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
