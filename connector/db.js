const MongoClient = require("mongodb").MongoClient;
const keys = require("../config/keys");

let connection = null;
const client = MongoClient.connect(keys.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Singleton function to get the DB.
getDb = async () => {
  try {
    if (connection != null) {
    } else {
      const connector = await client;
      connection = await connector.db("stuart");
    }
    return connection;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { getDb };
