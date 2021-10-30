import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";

import { DateTime } from "luxon";
import { IoMdClose } from "react-icons/io";
import DeleteChoreModal from "./HouseModals/DeleteChoreModal";

export default function Chore(props) {
  const [choreComplete, setChoreComplete] = useState(false);
  const [choreAssignee, setChoreAssignee] = useState("Me");
  const { currentUser } = useAuth();

  const [showDeleteChore, setShowDeleteChore] = useState(false);

  const getRecurringTitle = (count) => {
    switch (count) {
      case "0":
        return "One-time";
      case "1":
        return "Daily";
      case "2":
        return "Bi-daily";
      case "7":
        return "Weekly";
      case "14":
        return "Bi-weekly";
      case "21":
        return "Tri-weekly";
      case "30":
        return "Monthly";
      case "60":
        return "Bi-monthly";

      default:
        return "None";
    }
  };

  useEffect(() => {
    let members = props.members;
    let assignee = props.chore.rotation.assignee;

    for (let i = 0; i < members.length; i++) {
      if (members[i].email === assignee) {
        if (assignee === currentUser.email) setChoreAssignee("Me");
        else setChoreAssignee(members[i].name.split(" ")[0]);
      }
    }

    setChoreComplete(props.chore.completed);
  }, [props.chore]);

  return (
    <div
      className={`flex flex-row mt-2 py-2 ${
        choreComplete ? "bg-primary-100" : "bg-white"
      } rounded-lg items-center px-2 md:px-4 shadow-md`}
    >
      <DeleteChoreModal
        show={showDeleteChore}
        onHide={() => setShowDeleteChore(false)}
        deleteChoreButton={props.deleteChoreButton}
      />
      <span className="cursor-pointer" onClick={props.toggleChoreButton}>
        {choreComplete ? (
          <AiFillCheckCircle size="1.25em" color="#1F8FFF" />
        ) : (
          <AiOutlineCheckCircle size="1.25em" />
        )}
      </span>

      <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-start items-center md:justify-between w-full mr-2 md:mr-8">
        <text className="font-title font-semibold text-sm pl-2 md:ml-2">
          {choreAssignee}&emsp;
          <text className="text-primary-600">
            {getRecurringTitle(props.chore.rotation.recurring)}
          </text>
        </text>

        <text
          className={`font-regular text-sm pl-2 ${
            choreComplete && "line-through"
          }`}
        >
          {props.chore.description}
        </text>

        <text className="font-title font-semibold text-sm pl-2">
          {DateTime.fromISO(props.chore.timestamp).toLocaleString(
            DateTime.DATE_MED
          )}
        </text>
      </div>
      <Button
        type="primary"
        size="md"
        className="py-1 px-2 items-center"
        onClick={() => setShowDeleteChore(true)}
      >
        <IoMdClose size="1.25em" />
      </Button>
    </div>
  );
}
