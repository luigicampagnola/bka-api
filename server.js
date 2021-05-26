const express = require("express");

const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "123",
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
  ],
};

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is working");
});

app.post("/signin", (req, res) => {
  res.json("signing");
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/* 
  / Root--> res = this is working
  /signin --> POST  = success or fail
  /register --> POST = user
  /profile/:userId ---> GET = user
  /transactions --> PUT --> user

*/
