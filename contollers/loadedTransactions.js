const loadedtransactionsHandler = (req, res) => {
  const { email } = req.body;

  db.select("*")
    .from("movements")
    .where("email", "=", email)
    .then((data) => {
      res.json(data);
    });
};

module.exports = {
  loadedtransactions: loadedtransactionsHandler,
};
