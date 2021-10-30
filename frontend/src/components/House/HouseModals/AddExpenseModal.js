import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Button from "../../Button";
import { Dropdown } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import LoadOverlay from "../../LoadOverlay";
import "./modal-styles.scss";

export default function AddExpenseModal(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);

  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payee, setPayee] = useState({ name: "None", email: "xd@xd.com" });
  const [payers, setPayers] = useState([]);

  useEffect(() => {
    if (
      expenseDescription.trim() === "" ||
      expenseAmount.trim() === "" ||
      !payee ||
      payee.name.trim() === "None" ||
      payers.length < 1
    )
      setDisableSubmit(true);
    else setDisableSubmit(false);
  }, [expenseDescription, expenseAmount, payee, payers]);

  const togglePayers = (member) => {
    console.log(member);

    let tmpMembers = payers;

    if (tmpMembers.includes(member)) {
      tmpMembers.pop(tmpMembers.indexOf(member));
      setPayers([...tmpMembers]);
    } else {
      setPayers([...payers, member]);
    }

    // if (tmpMembers.length === 0) {
    //   setStartingAssignee({
    //     name: "None",
    //     email: "None@None.com",
    //   });
    // }
  };

  async function handleSubmit() {
    setLoading(true);
    setError("");

    let divideAmount = payers.length;
    let amount = parseFloat(expenseAmount);
    let payerList = payers;

    for (let i = 0; i < payerList.length; i++) {
      console.log(payerList[i]);
      if (payerList[i].email === payee.email) {
        payerList.splice(i, 1);
        amount = amount - amount / divideAmount;
        divideAmount -= 1;
        break;
      }
    }

    const expense = {
      expenseID: new Date().valueOf(),
      description: expenseDescription,
      amount: amount.toFixed(2),
      payee: payee.email,
      payers: payerList.map((payer) => {
        return {
          email: payer.email,
          amount: (amount / divideAmount).toFixed(2),
        };
      }),

      completed: false,
    };
    try {
      await props.handleSubmit(expense);

      setLoading(false);
      setError("");
      props.onHide();
    } catch {
      setError("Could not add expense.");
    } finally {
      setLoading(false);
    }
  }

  const onChangeDescription = (e) => {
    setExpenseDescription(e.currentTarget.value);
  };

  const onChangeAmount = (e) => {
    // let expense = parseFloat((e.current.value).val(), 10).toFixed(2);
    // setExpenseAmount(expense);
    let val = e.currentTarget.value;
    var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
    var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;

    if (re.test(val)) {
      setExpenseAmount(val.toString());
    } else {
      val = re1.exec(val);
      if (val) {
        setExpenseAmount(val[0].toString());
      } else {
        setExpenseAmount("");
      }
    }

    // setExpenseAmount(val);
  };

  useEffect(() => {
    if (props.show === false) {
      setExpenseDescription("");
      setExpenseAmount("");
      setPayee("");
      setPayers([]);
    }
  }, [props.show]);

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      {loading && <LoadOverlay />}
      <ModalBody>
        <div className="flex flex-col">
          <text className="font-title font-semibold text-xl ml-1 mb-3">
            Add an <text className="text-primary-600">expense</text>
          </text>

          {/* DESCRIPTION */}
          <text className="font-title font-semibold text-md mb-2 ml-1">
            Description
          </text>
          <input
            disabled={loading === true}
            className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
            id="expenseDescription"
            type="text"
            placeholder="Description"
            maxLength={50}
            onChange={onChangeDescription}
            value={expenseDescription}
          ></input>

          <div className="flex flex-row mt-3 items-center">
            {/* AMOUNT */}
            <div className="flex flex-col">
              <text className="font-title font-semibold text-md ml-1 mb-1">
                Amount
              </text>
              <input
                disabled={loading === true}
                className="font-regular appearance-none border rounded-lg w-32 py-2 px-3 focus:outline-none focus:shadow-outline"
                id="amountDescription"
                type="text"
                placeholder="0.00"
                maxLength={10}
                onChange={onChangeAmount}
                value={expenseAmount}
              >
                {/* <text>$</text> */}
              </input>
            </div>

            {/* PAYEE */}
            <div className="flex flex-col ml-8">
              <text className="font-semibold font-title">Who paid?</text>
              <Dropdown className="font-regular font-normal">
                <Dropdown.Toggle
                  className="font-regular font-normal mt-1 bg-primary-600 hover:bg-primary-400 focus:bg-primary-600 focus-within:bg-primary-600 h-10"
                  id="dropdown-autoclose-true"
                >
                  {payee ? payee.name : "None"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {props.members.map((member) => {
                    return (
                      <Dropdown.Item
                        key={member.email + "1"}
                        onClick={() => setPayee(member)}
                      >
                        {member.name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* PAYERS SELECT */}
          <div className="mt-3">
            <text className="font-semibold font-title">
              Select who owes an equal share
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
                      onClick={() => togglePayers(member)}
                    />
                  </div>
                );
              })}
            </div>
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
              Add expense
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
