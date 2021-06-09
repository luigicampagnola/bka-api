const transactionHandler = (req, res, db) => {
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
};

module.exports = {
  transactionHandler: transactionHandler,
};
