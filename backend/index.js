import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import usersDAO from "./dao/usersDAO.js";
import housesDAO from "./dao/housesDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.DB_URI, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await usersDAO.injectDB(client);
    await housesDAO.injectDB(client);

    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
