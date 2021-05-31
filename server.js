const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const postgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "badb",
  },
});

postgres.select("*").from("users");

const database = {
  users: [
    {
      id: "123",
      name: "Admin",
      email: "admin@gmail.com",
      password: "123",
      joined: new Date(),
      transactions: {
        movements: [
          {
            id: 1,
            Type: "",
            Date: "",
            Amount: 0,
          },
        ],
      },
    },
    {
      id: "124",
      name: "carl",
      email: "carl@gmail.com",
      password: "1234",
      joined: new Date(),
      transactions: {
        movements: [
          {
            id: 0,
            Type: "Withdrawal",
            Date: "05/23/2021 at 17:11",
            Amount: 0,
          },
        ],
      },
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
    function (err, res) {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$x81NHeyZwkeWkB1NZ14os.yEJq0sMq.CcDT/z8Z0809Lx9iGezBSm",
    function (err, res) {
      console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
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
  res.json(database.users[database.users.length - 1]);
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

app.put("/transactions", (req, res) => {
  const { id, movements } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      database.users[0].transactions.movements.push(movements);
      return res.json(user.transactions.movements);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
