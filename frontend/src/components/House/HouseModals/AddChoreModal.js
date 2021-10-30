import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Button from "../../Button";
import { Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import "react-datepicker/dist/react-datepicker.css";
import LoadOverlay from "../../LoadOverlay";

export default function AddChoreModal(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const today = new Date();

  const [choreDescription, setChoreDescription] = useState("");
  const [recurring, setRecurring] = useState("One-time");
  const [rotation, setRotation] = useState([]);
  const [startingAssignee, setStartingAssignee] = useState({
    name: "None",
    email: "None@None.com",
  });
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (
      choreDescription.trim() === "" ||
      rotation.length < 1 ||
      startingAssignee.email === "None@None.com"
    )
      setDisableSubmit(true);
    else setDisableSubmit(false);
  }, [choreDescription, rotation, startingAssignee]);

  const toggleRotation = (member) => {
    let tmpRotation = rotation;

    if (tmpRotation.includes(member)) {
      tmpRotation.pop(tmpRotation.indexOf(member));
      setRotation([...tmpRotation]);
    } else {
      setRotation([...rotation, member]);
    }

    if (tmpRotation.length === 0) {
      setStartingAssignee({
        name: "None",
        email: "None@None.com",
      });
    }
  };

  const convertRecurring = (label) => {
    switch (label) {
      case "One-time":
        return "0";
      case "Daily":
        return "1";
      case "Bi-daily":
        return "2";
      case "Weekly":
        return "7";
      case "Bi-weekly":
        return "14";
      case "Tri-weekly":
        return "21";
      case "Monthly (30d)":
        return "30";
      case "Bi-monthly (60d)":
        return "60";
    }
  };

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const chore = {
      choreID: new Date().valueOf(),
      description: choreDescription,
      timestamp: DateTime.fromISO(startDate.toISOString()).toISO(),
      rotation: {
        assignee: startingAssignee.email,
        members: rotation,
        recurring: convertRecurring(recurring),
      },
      completed: false,
    };

    await props
      .handleSubmit(chore)
      .then(() => {
        setLoading(false);
        setError("");
        props.onHide();
      })
      .catch(() => {
        setError("Could not add chore.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onChangeDescription = (e) => {
    setChoreDescription(e.currentTarget.value);
  };

  useEffect(() => {
    if (props.show === false) {
      setError("");
      setRecurring("One-time");
      setStartDate(new Date());
      setChoreDescription("");
      setRotation([]);
      setStartingAssignee({
        name: "None",
        email: "None@None.com",
      });
    }
  }, [props.show]);

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      {loading && <LoadOverlay />}
      <ModalBody>
        <div className="flex flex-col">
          <text className="font-title font-semibold text-xl ml-1 mb-3">
            Add a <text className="text-primary-600">chore</text>
          </text>

          {/* DESCRIPTION */}
          <text className="font-title font-semibold text-md mb-2 ml-1">
            Description
          </text>
          <input
            disabled={loading === true}
            className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
            id="choreDescription"
            type="text"
            placeholder="Description"
            maxLength={50}
            onChange={onChangeDescription}
            value={choreDescription}
          ></input>

          {/* ROTATION */}
          <div className="flex flex-row space-x-10 mt-3 ml-1 items-center">
            <div>
              <text className="font-title font-semibold text-md">Rotation</text>
              <Dropdown className="font-regular font-normal bg-primary-100 mt-2">
                <Dropdown.Toggle
                  className="font-regular font-normal bg-primary-600 hover:bg-primary-400 focus:bg-primary-600 focus-within:bg-primary-600 h-10"
                  id="dropdown-autoclose-true"
                >
                  {recurring}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRecurring("One-time")}>
                    One-time
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Daily")}>
                    Daily
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Bi-daily")}>
                    Bi-Daily
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Weekly")}>
                    Weekly
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Bi-weekly")}>
                    Bi-Weekly
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Tri-weekly")}>
                    Tri-weekly
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRecurring("Monthly (30d)")}>
                    Monthly (30d)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setRecurring("Bi-monthly (60d)")}
                  >
                    Bi-monthly (60d)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="w-28">
              {/* START DATE */}
              <text className="font-title font-semibold text-md mb-2">
                Start date
              </text>

              <DatePicker
                className="font-regular font-normal mt-2 w-28 py-2 text-center rounded-lg bg-primary-600 text-white h-10 hover: cursor-pointer"
                minDate={today}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                value={DateTime.fromISO(startDate.toISOString()).toLocaleString(
                  DateTime.DATE_MED
                )}
              />
            </div>
          </div>

          {/* MEMBER SELECT */}
          <div className="mt-3">
            <text className="font-semibold font-title">
              Housemates involved
            </text>
            {/* MEMBERS */}
            <div className="flex flex-wrap mb-2 mt-1">
              {props.members.map((member) => {
                return (
                  <div
                    className="text-regular mr-2 my-1 py-1 px-2 border-1 border-gray-200 rounded-xl flex items-center flex-row"
                    key={member.email}
                  >
                    <text>{member.name}</text>
                    <input
                      className="ml-2"
                      type="checkbox"
                      onClick={() => toggleRotation(member)}
                    />
                  </div>
                );
              })}
            </div>

            {/* FIRST MEMBER */}
            <text className="font-semibold font-title">First assignee</text>
            <Dropdown className="font-regular font-normal" class="disabled">
              <Dropdown.Toggle
                disabled={rotation.length < 1}
                className="font-regular font-normal mt-1 bg-primary-600 hover:bg-primary-400 focus:bg-primary-600 focus-within:bg-primary-600 h-10"
                id="dropdown-autoclose-true"
              >
                {rotation.length > 0 ? startingAssignee.name : "None"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {rotation.map((member) => {
                  return (
                    <Dropdown.Item
                      key={member.email + "1"}
                      onClick={() => setStartingAssignee(member)}
                    >
                      {member.name}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {error && (
            <text className="font-title font-semibold text-red-500 text-md mt-3 ml-1">
              {error}
            </text>
          )}

          <div className="w-full flex flex-row justify-end mt-2">
            <Button
              type="secondary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2 border-1 border-gray-300"}
              onClick={props.onHide}
            >
              Cancel
            </Button>

            <Button
              disabled={disableSubmit}
              type="primary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2"}
              onClick={() => handleSubmit()}
            >
              Add chore
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
