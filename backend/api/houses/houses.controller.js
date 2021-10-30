import housesDAO from "../../dao/housesDAO.js";

export default class housesController {
  static async apiGetAllHouses(req, res, next) {
    const { houseList, totalNumHouses } = await housesDAO.getAllHouses();

    let response = {
      houseList: houseList,
      total_results: totalNumHouses,
    };
    res.json(response);
  }

  // GET
  static async apiGetHouse(req, res, next) {
    try {
      let id = req.query.houseID || "";
      let code = req.query.houseCode || "";

      const { house } = await housesDAO.getHouse(id, code);

      let response = {
        house: house[0],
      };

      res.json(response);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // CREATE
  static async apiCreateHouse(req, res, next) {
    try {
      const newHouseID = req.body.houseID;
      const houseName = req.body.houseName;
      const houseCode = req.body.houseCode;
      const founderName = req.body.founderName;
      const founderEmail = req.body.founderEmail;

      const createResponse = await housesDAO.createHouse(
        newHouseID,
        houseName,
        houseCode,
        founderName,
        founderEmail
      );

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // UPDATE MEMBERS
  static async apiUpdateMembers(req, res, next) {
    try {
      const houseID = req.body.houseID;
      const members =
        req.body.members === ""
          ? []
          : JSON.parse(decodeURIComponent(req.body.members));

      const memberName = req.body.memberName;
      const memberEmail = req.body.memberEmail;
      const deleteMember = req.body.deleteMember === "true";

      const updateResponse = await housesDAO.updateMembers(
        houseID,
        members,
        memberName,
        memberEmail,
        deleteMember
      );

      var { error } = updateResponse;

      if (error) {
        res.status(400).json({ error });
        console.log(error.message);
      }

      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update members. Request may not be authorized."
        );
      }

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // UPDATE CHORES
  static async apiUpdateChores(req, res, next) {
    try {
      const houseID = req.body.houseID;
      const choresList =
        req.body.choresList === ""
          ? []
          : JSON.parse(decodeURIComponent(req.body.choresList));

      const chore =
        req.body.chore === ""
          ? {}
          : JSON.parse(decodeURIComponent(req.body.chore));

      const completeChore = req.body.completeChore === "true";
      const editRotation = req.body.editRotation === "true";
      const deleteChore = req.body.deleteChore === "true";

      const updateResponse = await housesDAO.updateChores(
        houseID,
        choresList,
        chore,
        completeChore,
        editRotation,
        deleteChore
      );

      var { error } = updateResponse;

      if (error) {
        res.status(400).json({ error });
        console.log(error.message);
      }

      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update chores. Request may not be authorized."
        );
      }

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // ROTATE CHORE
  static async apiTriggerSchedule(req, res, next) {
    try {
      const houseID = req.body.houseID;
      const chore =
        req.body.chore === ""
          ? {}
          : JSON.parse(decodeURIComponent(req.body.chore));
      const recurring = parseInt(req.body.recurring);

      const updateResponse = await housesDAO.triggerSchedule(
        houseID,
        chore,
        recurring
      );

      var { error } = updateResponse;

      if (error) {
        res.status(400).json({ error });
        console.log(error.message);
      }

      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to rotate chore. Request may not be authorized."
        );
      }

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // UPDATE EXPENSES
  static async apiUpdateExpenses(req, res, next) {
    try {
      const houseID = req.body.houseID;
      const expensesList =
        req.body.expensesList === ""
          ? []
          : JSON.parse(decodeURIComponent(req.body.expensesList));

      const expense =
        req.body.expense === ""
          ? {}
          : JSON.parse(decodeURIComponent(req.body.expense));

      const expenseToggler = req.body.expenseToggler;
      const deleteExpense = req.body.deleteExpense === "true";

      const updateResponse = await housesDAO.updateExpenses(
        houseID,
        expensesList,
        expense,
        expenseToggler,
        deleteExpense
      );

      var { error } = updateResponse;

      if (error) {
        res.status(400).json({ error });
        console.log(error.message);
      }

      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update expenses. Request may not be authorized."
        );
      }

      res.json({ status: "Success." });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // DELETE
  static async apiDeleteHouse(req, res, next) {
    try {
      const houseID = req.body.houseID;

      const deleteResponse = await housesDAO.deleteHouse(houseID);

      res.json({ status: "Success." });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
