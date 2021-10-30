import http from "../http-common.js";

class UserDataService {
  createUser(uuid, name, email) {
    const body = {
      userID: uuid,
      name: name,
      email: email,
    };

    return http.post(`/users`, body);
  }

  getUser(uuid) {
    return http.get(`/users?userID=${uuid}`);
  }

  modifyUser(uuid, houses, houseID, houseEnabled, deleteHouse) {
    const body = {
      userID: uuid,
      houses: encodeURIComponent(JSON.stringify(houses)),
      houseID: houseID,
      houseEnabled: houseEnabled,
      deleteHouse: deleteHouse,
    };

    return http.put(`/users`, body);
  }
}

export default new UserDataService();
