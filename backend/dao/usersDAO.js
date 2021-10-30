import e from "express";
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let users;

export default class usersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.HOUSE_KEEPER_NS).collection("users");
    } catch (e) {
      console.error(
        `Unable to establish a connection handle in usersDAO: ${e}`
      );
    }
  }

  // // GET ALL
  // static async getAllUsers() {
  //   let cursor;

  //   try {
  //     cursor = await users.find({});
  //   } catch (e) {
  //     console.error(`Unable to issue find command, ${e}`);
  //     return { users: [], totalNumUser: 0 };
  //   }

  //   const displayCursor = cursor;

  //   try {
  //     const userList = await displayCursor.toArray();
  //     const totalNumUsers = await users.countDocuments({});

  //     return { userList, totalNumUsers };
  //   } catch (e) {
  //     console.error(
  //       `Unable to convert cursor to array or problem counting documents, ${e}`
  //     );
  //     return { userList: [], totalNumUsers: 0 };
  //   }
  // }

  // GET
  static async getUser(userID) {
    let query = {
      userID: userID,
    };

    let cursor;

    try {
      cursor = await users.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { users: [], totalNumUser: 0 };
    }

    const displayCursor = cursor;

    try {
      const user = await displayCursor.toArray();

      return { user };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { userInfoList: [] };
    }
  }

  // CREATE
  static async createUser(userID, name, email) {
    console.log("creating...");
    try {
      const newUserDoc = {
        userID: userID,
        name: name,
        email: email,
        houses: [],
      };

      return await users.insertOne(newUserDoc);
    } catch (e) {
      console.error(`Unable to create user: ${e}`);
      return { error: e };
    }
  }

  // UPDATE
  static async updateUser(userID, houses, houseID, houseEnabled, deleteHouse) {
    try {
      let i = 0;

      console.log({
        userID,
        houses,
        houseID,
        houseEnabled,
        deleteHouse,
      });

      for (i; i < houses.length; i++) {
        if (houses[i].houseID === houseID) {
          break;
        }
      }

      if (deleteHouse === true) {
        houses.splice(i, 1);
      } else if (i === houses.length) {
        houses.push({
          houseID: houseID,
          enabled: true,
        });
      } else {
        houses[i].enabled = houseEnabled;
      }

      console.log("House LIST");
      console.log(houses);
      
      let updatedUser = {
        $set: {},
      };

      updatedUser.$set["houses"] = houses;

      const updateResponse = await users.updateOne(
        { userID: userID },
        updatedUser
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update user: ${e}`);
      return { error: e };
    }
  }

  // DELETE
  static async deleteUser(userID) {
    try {
      const deleteResponse = await users.deleteOne({
        userID: userID,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete user: ${e}`);
      return { error: e };
    }
  }
}
