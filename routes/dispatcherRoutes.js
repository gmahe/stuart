const { getDb } = require("../connector/db");

// Dispatcher
module.exports = (app) => {
  // Returns all couriers over capacity_required.
  app.get("/couriers/lookup", async ({ body }, res, next) => {
    const { capacity_required } = body;
    if (isNaN(capacity_required)) {
      res.status(500).send({ error: "You need to have capacity_required" });
    } else {
      const db = await getDb();
      const result = await db
        .collection("courier")
        .find({ max_capacity: { $gte: Number(capacity_required) } })
        .toArray();
      res.send(result);
    }
  });
};
