import e from "express";
import mongodb from "mongodb";
import { DateTime } from "luxon";
import {
  scheduleJob,
  cancelJob,
  RecurrenceRule,
  Range,
  Job,
} from "node-schedule";
const ObjectId = mongodb.ObjectID;

let houses;

export default class usersDAO {
  static async injectDB(conn) {
    if (houses) {
      return;
    }
    try {
      houses = await conn.db(process.env.HOUSE_KEEPER_NS).collection("houses");
    } catch (e) {
      console.error(
        `Unable to establish a connection handle in usersDAO: ${e}`
      );
    }
  }

  // GET
  static async getHouse(queryHouseID = "", queryHouseCode = "") {
    let query = {};

    if (queryHouseCode === "") {
      query["houseID"] = queryHouseID;
    } else {
      query["houseCode"] = queryHouseCode;
    }

    let cursor;

    try {
      cursor = await houses.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { houses: [], totalNumHouse: 0 };
    }

    const displayCursor = cursor;

    try {
      const house = await displayCursor.toArray();

      return { house };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { userInfoList: [] };
    }
  }

  // CREATE
  static async createHouse(
    newHouseID,
    houseName,
    houseCode,
    founderName,
    founderEmail
  ) {
    try {
      const newHouseDoc = {
        houseID: newHouseID,
        houseName: houseName,
        houseCode: houseCode,
        members: [
          {
            name: founderName,
            email: founderEmail,
          },
        ],
        chores: [],
        expenses: [],
      };

      return await houses.insertOne(newHouseDoc);
    } catch (e) {
      console.error(`Unable to create house: ${e}`);
      return { error: e };
    }
  }

  // UPDATE MEMBERS
  static async updateMembers(
    houseID,
    members,
    memberName,
    memberEmail,
    deleteMember
  ) {
    try {
      if (deleteMember === true) {
        for (let i = 0; i < members.length; i++) {
          if (members[i].email === memberEmail) {
            members.splice(i, 1);
            break;
          }
        }
      } else {
        members.push({
          name: memberName,
          email: memberEmail,
        });
      }

      let updatedMembers = {
        $set: {},
      };

      updatedMembers.$set["members"] = members;

      const updateResponse = await houses.updateOne(
        { houseID: houseID },
        updatedMembers
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update house members: ${e}`);
      return { error: e };
    }
  }

  static async triggerSchedule(houseID, chore, days) {
    async function rotateChore(houseID, chore) {
      try {
        console.log("Moving forward");
        // Get current assignee
        const currAssignee = chore.rotation.assignee;

        // Increment chore assignee by 1.
        for (let i = 0; i < chore.rotation.members.length; i++) {
          if (chore.rotation.members[i] === currAssignee) {
            chore.rotation.assignee =
              chore.rotation.members[(i + 1) % chore.rotation.members.length];
          }
        }

        // Update chore timestamp
        let choreDate = chore.timestamp;
        const oldDate = DateTime.fromISO(choreDate);

        const newDate = oldDate.plus({
          days: Number.parseInt(chore.rotation.recurring),
        });
        chore.timestamp = newDate.toString();
        chore.completed = false;

        const response = await houses.updateOne(
          {
            houseID: houseID,
            "chores.choreID": chore.choreID,
          },
          { $set: { "chores.$": chore } }
        );
      } catch (e) {
        console.error(`Unable to update chore rotation: ${e}`);
        return { error: e };
      }
    }

    // Get old timestamp and add X number of days. Convert to server timezone
    const oldTimestamp = DateTime.fromISO(chore.timestamp).toLocal();

    const newTimestamp = oldTimestamp.plus({
      days: Number.parseInt(chore.rotation.recurring),
    });

    const hour = newTimestamp.hour;
    const day = newTimestamp.day;
    // Luxon month is 1-12. Convert to 0-11.
    const month = newTimestamp.month - 1;

    const rule = new RecurrenceRule();
    rule.month = month;
    rule.date = day;
    rule.hour = hour;
    rule.minute = 0;

    const id = chore.choreID + "mickey mouse scheduler";
    const something = scheduleJob(id, rule, function () {
      rotateChore(houseID, chore);
    });

    // console.log(something.pendingInvocations[0].job.pendingInvocations[0]);

    return { error: "" };
  }

  // UPDATE CHORES
  static async updateChores(
    houseID,
    choresList,
    chore,
    completeChore,
    editRotation,
    deleteChore
  ) {
    console.log({
      houseID,
      choresList,
      chore,
      completeChore,
      editRotation,
      deleteChore,
    });

    try {
      let i = 0;
      for (i; i < choresList.length; i++) {
        if (choresList[i].choreID === chore.choreID) {
          break;
        }
      }

      // Delete chore
      if (deleteChore === true) {
        if (chore.rotation.recurring !== "0") {
          const cancelID = choresList[i].choreID + "mickey mouse scheduler";
          cancelJob(cancelID);
        }

        choresList.splice(i, 1);
      }
      // New chore
      else if (i === choresList.length) {
        choresList.push(chore);
      }
      // Existing chore
      else {
        // Editing chore rotation
        if (editRotation) {
          console.log("editing xd");
        }
        // Updating chore completeness
        else {
          choresList[i].completed = completeChore;
        }
      }

      let updatedHouse = {
        $set: {},
      };

      updatedHouse.$set["chores"] = choresList;

      const updateResponse = await houses.updateOne(
        { houseID: houseID },
        updatedHouse
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update house: ${e}`);
      return { error: e };
    }
  }

  // UPDATE EXPENSES
  static async updateExpenses(
    houseID,
    expensesList,
    expense,
    expenseToggler,
    deleteExpense
  ) {
    try {
      let i = 0;
      for (i; i < expensesList.length; i++) {
        if (expensesList[i].expenseID === expense.expenseID) {
          break;
        }
      }

      // Delete expense
      if (deleteExpense === true) {
        expensesList.splice(i, 1);
      }
      // New expense
      else if (i === expensesList.length) {
        expensesList.push(expense);
      }
      // Existing expense
      else {
        // Expense payee is the toggler
        if (expenseToggler === expense.payee) {
          expensesList[i].completed = !expensesList[i].completed;
        }

        // A payer is updating their 'paid' status
        else {
          console.log(expensesList);
          for (let j = 0; j < expensesList[i].payers.length; j++) {
            if (expense.payers[j].email === expenseToggler) {
              expensesList[i].payers[j].paid = !expensesList[i].payers[j].paid;
            }
          }

          // If all payees have paid, mark expense as completed
          let tmpComplete = true;

          for (let j = 0; j < expensesList[i].payers.length; j++) {
            tmpComplete = expensesList[i].payers[j].paid && tmpComplete;
          }

          expensesList[i].completed = tmpComplete;
        }
      }

      let updatedHouse = {
        $set: {},
      };

      updatedHouse.$set["expenses"] = expensesList;

      const updateResponse = await houses.updateOne(
        { houseID: houseID },
        updatedHouse
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update expenses: ${e}`);
      return { error: e };
    }
  }

  // DELETE
  static async deleteHouse(houseID) {
    try {
      const deleteResponse = await houses.deleteOne({
        houseID: houseID,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete house: ${e}`);
      return { error: e };
    }
  }
}
