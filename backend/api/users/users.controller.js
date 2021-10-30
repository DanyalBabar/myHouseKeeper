import usersDAO from "../../dao/usersDAO.js";

export default class usersController {
  static async apiGetAllUsers(req, res, next) {
    const { userList, totalNumUsers } = await usersDAO.getAllUsers();

    let response = {
      userList: userList,
      total_results: totalNumUsers,
    };
    res.json(response);
  }

  // GET
  static async apiGetUser(req, res, next) {
    try {
      let id = req.query.userID || {};

      const { user } = await usersDAO.getUser(id);

      let response = {
        user: user[0],
      };

      res.json(response);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // CREATE
  static async apiCreateUser(req, res, next) {
    try {
      const newUserID = req.body.userID;
      const name = req.body.name;
      const email = req.body.email;

      const createResponse = await usersDAO.createUser(newUserID, name, email);

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // UPDATE
  static async apiUpdateUser(req, res, next) {
    try {
      const userID = req.body.userID;
      const houses =
        req.body.houses === ""
          ? []
          : JSON.parse(decodeURIComponent(req.body.houses));
      const houseID = req.body.houseID;
      const houseEnabled = req.body.enabled === "true";
      const deleteHouse = req.body.deleteHouse === "true";

      const updateResponse = await usersDAO.updateUser(
        userID,
        houses,
        houseID,
        houseEnabled,
        deleteHouse
      );

      var { error } = updateResponse;

      if (error) {
        res.status(400).json({ error });
        console.log(error.message);
      }

      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update user. User may not be the account owner."
        );
      }

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // DELETE
  static async apiDeleteUser(req, res, next) {
    try {
      const userID = req.body.userID;

      const deleteResponse = await usersDAO.deleteUser(userID);

      res.json({ status: "Success." });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
