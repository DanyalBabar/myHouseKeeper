import http from "../http-common.js";

class HouseDataService {
  createHouse(houseID, houseName, houseCode, founderName, founderEmail) {
    const body = {
      houseID: houseID,
      houseName: houseName,
      houseCode: houseCode,
      founderName: founderName,
      founderEmail: founderEmail,
    };

    return http.post(`/houses`, body);
  }

  getHouse(houseID = "", houseCode = "") {
    return http.get(`/houses/?houseID=${houseID}&houseCode=${houseCode}`);
  }

  modifyMembers(houseID, members, memberName, memberEmail, deleteMember) {
    const body = {
      houseID: houseID,
      members: encodeURIComponent(JSON.stringify(members)),
      memberName: memberName,
      memberEmail: memberEmail,
      deleteMember: deleteMember,
    };

    return http.put(`/houses/members`, body);
  }

  modifyChores(
    houseID,
    choresList,
    chore,
    completeChore,
    editRotation,
    deleteChore
  ) {
    const body = {
      houseID: houseID,
      choresList: encodeURIComponent(JSON.stringify(choresList)),
      chore: encodeURIComponent(JSON.stringify(chore)),
      completeChore: completeChore,
      editRotation: editRotation,
      deleteChore: deleteChore,
    };

    return http.put(`/houses/chores`, body);
  }

  triggerSchedule(houseID, chore, recurring) {
    const body = {
      houseID: houseID,
      chore: encodeURIComponent(JSON.stringify(chore)),
      recurring: recurring,
    };

    return http.put(`/houses/triggerSchedule`, body);
  }

  modifyExpenses(
    houseID,
    expensesList,
    expense,
    expenseToggler,
    deleteExpense
  ) {
    const body = {
      houseID: houseID,
      expensesList: encodeURIComponent(JSON.stringify(expensesList)),
      expense: encodeURIComponent(JSON.stringify(expense)),
      expenseToggler: expenseToggler,
      deleteExpense: deleteExpense,
    };

    return http.put(`/houses/expenses`, body);
  }

  delteHouse(houseID) {
    const body = {
      houseID: houseID,
    };

    return http.delete(`/houses`, body);
  }

  sendInvite(houseName, inviteLink, toAddress) {
    const body = {
      houseName: houseName,
      inviteLink: inviteLink,
      toAddress: toAddress,
    };

    return http.post(`/send_invite`, body);
  }
}

export default new HouseDataService();
