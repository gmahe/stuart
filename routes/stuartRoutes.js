// Stuart API
const { getDb } = require("../connector/db");

module.exports = (app) => {
  // Update capacity of a courier.
  // I chose patch instead of put because we're supposed to only change the max_capacity and not the other props.
  app.patch("/couriers/change_capacity/:id", async (req, res) => {
    const { id } = req.params;
    const { max_capacity } = req.body;

    if (isNaN(id) || isNaN(max_capacity)) {
      // Could log errors with Winston.
      res
        .status(500)
        .send({ error: "You need to have valid id and/or max_capacity" });
    } else {
      const db = await getDb();
      const result = await db
        .collection("courier")
        .updateOne(
          { _id: parseInt(id) },
          { $set: { max_capacity: parseInt(max_capacity) } }
        );
      res.send(result.result);
    }
  });

  // Create a new courier.
  app.post("/couriers", async (req, res) => {
    const { id, max_capacity } = req.body;
    if (isNaN(id) || isNaN(max_capacity)) {
      // Could log errors with Winston.
      res
        .status(500)
        .send({ error: "You need to have valid id and/or max_capacity" });
    } else {
      const db = await getDb();
      const result = await db
        .collection("courier")
        .insertOne({ _id: parseInt(id), max_capacity: parseInt(max_capacity) });
      res.send(result);
    }
  });

  // Delete a courier.
  app.delete("/couriers/:id", async function (req, res) {
    const { id } = req.params;
    if (isNaN(id)) {
      // Could log errors with Winston.
      res.status(500).send({ error: "You need to have valid id" });
    } else {
      const db = await getDb();
      const result = await db
        .collection("courier")
        .deleteOne({ _id: parseInt(id) });
      res.send(result.result);
    }
  });
};
