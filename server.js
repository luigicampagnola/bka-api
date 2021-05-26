const express = require("express");

const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "123",
      joined: new Date(),
      transactions: {
        movements: [
          {
            id: 0,
            Type: "Deposit",
            Date: "05/23/2021 at 17:11",
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
};

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    joined: new Date(),
    transactions: {
      movements: [
        {
          id: 0,
          Type: "Deposit",
          Date: "05/23/2021 at 17:11",
          Amount: 0,
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

app.post("/transactions", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user.transactions);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

