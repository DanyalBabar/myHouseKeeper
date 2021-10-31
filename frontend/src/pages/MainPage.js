import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";
import UserDataService from "../services/user.js";
import HouseDataService from "../services/houses.js";

import { useWindowDimensions } from "../utilities/WindowDimensions.js";
import Sidebar from "../components/Sidebar";
import House from "../components/House/House.js";
import JoinHouseModal from "../components/Modals/JoinHouseModal";
import CreateHouseModal from "../components/Modals/CreateHouseModal";
import LoadOverlay from "../components/LoadOverlay";

export default function MainPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { width } = useWindowDimensions();

  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({});

  const [houseIDList, setHouseIDList] = useState([]);
  const [houses, setHouses] = useState([]);

  const joinHouse = async (houseCode) => {
    let memberName = currentUser.displayName;
    let memberEmail = currentUser.email;
    let deleteMember = "false";

    await HouseDataService.getHouse("", houseCode).then(async (resp) => {
      const houseID = resp.data.house.houseID;
      const members = resp.data.house.members;

      for (let i = 0; i < members.length; i++) {
        if (members[i].email === memberEmail) {
          throw Error("You are already in this house");
        }
      }

      await HouseDataService.modifyMembers(
        houseID,
        members,
        memberName,
        memberEmail,
        deleteMember
      );

      let uuid = currentUser.uid;
      let houseEnabled = "true";
      let deleteHouse = "false";

      await UserDataService.modifyUser(
        uuid,
        houseIDList,
        houseID,
        houseEnabled,
        deleteHouse
      );
    });

    await fetchUserData();
  };

  const leaveHouse = async (houseID) => {
    let memberName = currentUser.displayName;
    let memberEmail = currentUser.email;
    let deleteMember = "true";

    await HouseDataService.getHouse(houseID).then(async (resp) => {
      const members = resp.data.house.members;

      await HouseDataService.modifyMembers(
        houseID,
        members,
        memberName,
        memberEmail,
        deleteMember
      );

      let uuid = currentUser.uid;
      let houseEnabled = "true";
      let deleteHouse = "true";

      await UserDataService.modifyUser(
        uuid,
        houseIDList,
        houseID,
        houseEnabled,
        deleteHouse
      );
    });

    await fetchUserData();
  };

  const createHouse = async (houseName) => {
    let houseID = uuidv4();
    let houseCode = uuidv4();
    let founderName = currentUser.displayName;
    let founderEmail = currentUser.email;

    await HouseDataService.createHouse(
      houseID,
      houseName,
      houseCode,
      founderName,
      founderEmail
    ).then(async () => {
      await UserDataService.modifyUser(
        currentUser.uid,
        houseIDList,
        houseID,
        "true",
        "false"
      );
    });

    await fetchUserData();
  };

  const addChore = async (houseID, choresList, chore) => {
    let completeChore = "false";
    let editRotation = "false";
    let deleteChore = "false";

    await HouseDataService.modifyChores(
      houseID,
      choresList,
      chore,
      completeChore,
      editRotation,
      deleteChore
    );

    if (chore.rotation.recurring !== "0")
      await HouseDataService.triggerSchedule(
        houseID,
        chore,
        chore.rotation.recurring
      );

    await fetchUserData();
  };

  const deleteChore = async (houseID, choresList, chore) => {
    let completeChore = "false";
    let editRotation = "false";
    let deleteChore = "true";

    await HouseDataService.modifyChores(
      houseID,
      choresList,
      chore,
      completeChore,
      editRotation,
      deleteChore
    );

    await fetchUserData();
  };

  const toggleChore = async (houseID, choresList, chore) => {
    const completeChore = chore.completed === true ? "false" : "true";
    const editRotation = "false";
    const deleteChore = "false";

    await HouseDataService.modifyChores(
      houseID,
      choresList,
      chore,
      completeChore,
      editRotation,
      deleteChore
    );

    setHouseIDList([...houseIDList]);
  };

  const addExpense = async (houseID, expenseList, expense) => {
    const expenseToggler = currentUser.email;
    const deleteExpense = "false";

    await HouseDataService.modifyExpenses(
      houseID,
      expenseList,
      expense,
      expenseToggler,
      deleteExpense
    );

    await fetchUserData();
  };

  const deleteExpense = async (houseID, expenseList, expense) => {
    const expenseToggler = currentUser.email;
    const deleteExpense = "true";

    await HouseDataService.modifyExpenses(
      houseID,
      expenseList,
      expense,
      expenseToggler,
      deleteExpense
    );

    await fetchUserData();
  };

  const toggleExpense = async (houseID, expenseList, expense) => {
    const expenseToggler = currentUser.email;
    const deleteExpense = "false";

    await HouseDataService.modifyExpenses(
      houseID,
      expenseList,
      expense,
      expenseToggler,
      deleteExpense
    );

    await fetchUserData();
  };

  const sendInvite = async (houseName, inviteLink, email) => {
    await HouseDataService.sendInvite(houseName, inviteLink, email);
  };

  const fetchUserData = async () => {
    setLoading(true);

    await UserDataService.getUser(currentUser.uid)
      .then(async (resp) => {
        setUserData(resp.data.user);
        setHouseIDList(resp.data.user.houses);
      })

      .catch((err) => {
        setError(JSON.stringify(err));
        console.log(err);
      })

      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch houses on houseIDList change
  useEffect(async () => {
    let houseList = [];
    for (let i = 0; i < houseIDList.length; i++) {
      await HouseDataService.getHouse(houseIDList[i].houseID).then((resp) => {
        houseList.push(resp.data.house);
      });
    }

    setHouses(houseList);
  }, [houseIDList]);

  useEffect(async () => {
    // Fetch User
    await fetchUserData();
  }, ["hello"]);

  const [collapseNav, setCollapseNav] = useState(false);
  const [showJoinHouse, setShowJoinHouse] = useState(false);
  const [showCreateHouse, setShowCreateHouse] = useState(false);

  useEffect(() => {
    if (width < 1200) {
      setCollapseNav(true);
    } else {
      setCollapseNav(false);
    }
  }, [width]);

  return (
    <>
      {loading && <LoadOverlay />}

      <JoinHouseModal
        show={showJoinHouse}
        onHide={() => setShowJoinHouse(false)}
        onSubmit={(code) => joinHouse(code)}
      />
      <CreateHouseModal
        show={showCreateHouse}
        onHide={() => setShowCreateHouse(false)}
        onSubmit={(houseName) => createHouse(houseName)}
      />

      <div
        className="flex flex-row"
        style={{ minHeight: "100vh", maxHeight: "100vh", height: "100vh" }}
      >
        <Sidebar
          className=""
          collapse={collapseNav}
          joinHouseButton={() => setShowJoinHouse(true)}
          createHouseButton={() => setShowCreateHouse(true)}
          logout={logout}
        />

        <div
          className="items-center overflow-y-scroll break-words px-10 py-10"
          style={{
            marginLeft: collapseNav ? "50px" : "300px",
            transition: "300ms ease",
            width: collapseNav ? width - "50" : width - "300",
          }}
        >
          <text className="font-regular text-red-500 text-md mb-8">
            {error && error}
          </text>

          {houses.length > 0 ? (
            houses.map((house) => {
              return (
                <House
                  key={house.houseID}
                  house={house}
                  leaveHouseButton={() => leaveHouse(house.houseID)}
                  addChore={(houseID, chores, chore) =>
                    addChore(houseID, chores, chore)
                  }
                  deleteChore={(houseID, chores, chore) =>
                    deleteChore(houseID, chores, chore)
                  }
                  toggleChore={(houseID, chores, chore) =>
                    toggleChore(houseID, chores, chore)
                  }
                  addExpense={(houseID, expenses, expense) => {
                    addExpense(houseID, expenses, expense);
                  }}
                  deleteExpense={(houseID, expenses, expense) => {
                    deleteExpense(houseID, expenses, expense);
                  }}
                  toggleExpense={(houseID, expenses, expense) => {
                    toggleExpense(houseID, expenses, expense);
                  }}
                  sendInvite={(houseName, inviteLink, email) =>
                    sendInvite(houseName, inviteLink, email)
                  }
                />
              );
            })
          ) : (
            <div className="bg-primary-600 rounded-md justify-center items-center text-center text-white p-4 shadow-lg">
              <text className="font-title font-semibold text-xl">
                You're homeless!
                <br />
                <br />
              </text>
              <text className="font-regular text-xl">
                Create or join a house to get started
              </text>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
