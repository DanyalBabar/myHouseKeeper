import React, { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { IoMdAddCircle } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md";
import Chore from "./Chore";
import { DateTime } from "luxon";
import Expense from "./Expense";
import LeaveHouseModal from "./HouseModals/LeaveHouseModal.js";
import AddChoreModal from "./HouseModals/AddChoreModal.js";
import AddExpenseModal from "./HouseModals/AddExpenseModal.js";
import InviteModal from "./HouseModals/InviteModal";

const headerButtonStyle = "my-2 py-1 px-3 w-24 flex items-center";

export default function House(props) {
  const [houseID, setHouseID] = useState("");
  const [houseCode, setHouseCode] = useState("");

  const [houseName, setHouseName] = useState("");
  const [members, setMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [collapse, setCollapse] = useState(false);

  const [showInviteHouse, setShowInviteHouse] = useState(false);
  const [showLeaveHouse, setShowLeaveHouse] = useState(false);
  const [showAddChore, setShowAddChore] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const processHouseData = (house) => {
    let sortedChores = [];
    if (house.chores) {
      sortedChores = house.chores.sort((a, b) =>
        DateTime.fromISO(a.timestamp) > DateTime.fromISO(b.timestamp) ? 1 : -1
      );

      sortedChores = sortedChores.sort((a, b) =>
        a.completed > b.completed ? 1 : -1
      );
    }

    let sortedExpenses = house.expenses;
    sortedExpenses = sortedExpenses.sort((a, b) =>
      a.completed > b.completed ? 1 : -1
    );

    setHouseID(house.houseID);
    setHouseCode(house.houseCode);
    setHouseName(house.houseName);
    setExpenses(sortedExpenses);
    setChores(sortedChores);
    setMembers(house.members);
  };

  useEffect(() => {
    processHouseData(props.house);
  }, [props.house]);

  return (
    <div className="flex flex-col bg-primary-200 rounded-lg pb-4 shadow-md mb-8">
      <LeaveHouseModal
        show={showLeaveHouse}
        houseName={houseName}
        onHide={() => setShowLeaveHouse(false)}
        handleSubmit={() => props.leaveHouseButton(houseID)}
      />
      <AddChoreModal
        show={showAddChore}
        onHide={() => setShowAddChore(false)}
        handleSubmit={(chore) => props.addChore(houseID, chores, chore)}
        members={members}
      />
      <AddExpenseModal
        show={showAddExpense}
        onHide={() => setShowAddExpense(false)}
        handleSubmit={(expense) => props.addExpense(houseID, expenses, expense)}
        members={members}
      />
      <InviteModal
        show={showInviteHouse}
        onHide={() => setShowInviteHouse(false)}
        handleSubmit={(email) =>
          props.sendInvite(
            houseName,
            `http://localhost:3000/signup?code=${houseCode}`,
            email
          )
        }
        code={houseCode}
      />

      <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-3 justify-between shadow-md">
        <div className="flex flex-row items-center">
          <text className="font-title tracking-tight text-white text-lg mr-2">
            {houseName}
          </text>
          <span
            className="cursor-pointer text-white"
            onClick={() => setCollapse(!collapse)}
          >
            {collapse ? (
              <MdExpandMore size="2em" />
            ) : (
              <MdExpandLess size="2em" />
            )}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <Button
            type="secondary"
            size="md"
            className="my-2 md:ml-1 py-1 px-3 w-24 flex items-center"
            onClick={() => setShowLeaveHouse(true)}
          >
            Leave
            <MdDelete size="1.25em" />
          </Button>
        </div>
      </div>
      <div
        className="overflow-hidden"
        style={{
          transition: "250ms all",
          maxHeight: collapse ? "0px" : "10000px",
          overflow: "hidden",
        }}
      >
        <div className="px-4 pt-4 ">
          {/* HOUSEMATES */}
          <div className="bg-primary-300 backdrop-brightness-75 rounded-lg mb-3">
            <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-4 justify-between shadow-md">
              <text className="font-title tracking-tight text-white text-lg">
                Housemates
              </text>
              <Button
                type="secondary"
                size="md"
                className={headerButtonStyle + "mx-2"}
                onClick={() => setShowInviteHouse(true)}
              >
                Invite
                <IoPersonAdd size="1.25em" />
              </Button>
            </div>

            <div className="flex flex-wrap">
              {members.map((member) => {
                return (
                  <div
                    key={member.email}
                    className="flex flex-col md:flex-row break-all mt-2 py-2 px-2 mr-2 bg-white rounded-lg items-center shadow-md"
                  >
                    <text className="font-title font-semibold text-sm ">
                      {member.name}
                    </text>
                    <text className="font-regular text-sm pl-2 ">
                      {member.email}
                    </text>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHORES */}
          <div className="bg-primary-300 backdrop-brightness-75 rounded-lg mb-3">
            <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-4 justify-between shadow-md">
              <text className="font-title tracking-tight text-white text-lg">
                Chores
              </text>
              <Button
                type="secondary"
                size="md"
                className="my-2 py-1 px-2 justify-between flex flex-rowF items-center"
                onClick={() => setShowAddChore(true)}
              >
                <IoMdAddCircle size="1.25em" />
              </Button>
            </div>

            {chores.length > 0 ? (
              chores.map((chore) => {
                return (
                  <Chore
                    key={chore.choreID}
                    chore={chore}
                    members={members}
                    deleteChoreButton={() =>
                      props.deleteChore(houseID, chores, chore)
                    }
                    toggleChoreButton={() => {
                      props.toggleChore(houseID, chores, chore);
                    }}
                  />
                );
              })
            ) : (
              <div className="py-2 flex justify-center">
                <text className="font-regular text-sm text-white text-center">
                  No chores to display
                </text>
              </div>
            )}
          </div>

          <div className="bg-primary-300 backdrop-brightness-75 rounded-lg mb-3">
            <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-4 justify-between shadow-md">
              <text className="font-title tracking-tight text-white text-lg">
                Expenses
              </text>
              <Button
                type="secondary"
                size="md"
                className="my-2 py-1 px-2 justify-between flex flex-rowF items-center"
                onClick={() => setShowAddExpense(true)}
              >
                <IoMdAddCircle size="1.25em" />
              </Button>
            </div>
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                return (
                  <Expense
                    key={expense.expenseID}
                    expense={expense}
                    members={members}
                    deleteExpenseButton={() =>
                      props.deleteExpense(houseID, expenses, expense)
                    }
                    toggleExpenseButton={() =>
                      props.toggleExpense(houseID, expenses, expense)
                    }
                  />
                );
              })
            ) : (
              <div className="py-2 flex justify-center">
                <text className="font-regular text-sm text-white text-center">
                  No expenses to display
                </text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
