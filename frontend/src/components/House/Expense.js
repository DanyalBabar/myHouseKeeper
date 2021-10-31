import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { IoMdClose } from "react-icons/io";
import DeleteExpenseModal from "./HouseModals/DeleteExpenseModal";

export default function Expense(props) {
  const [expenseComplete, setExpenseComplete] = useState(false);
  const { currentUser } = useAuth();

  const [paid, setPaid] = useState(0.0);
  const [debt, setDebt] = useState(0.0);

  const [isPayee, setIsPayee] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const [showDeleteExpense, setShowDeleteExpense] = useState(false);

  const getName = (email) => {
    for (let i = 0; i < props.members.length; i++) {
      if (props.members[i].email === email) {
        return props.members[i].name;
      }
    }

    return "NotFound NotFound";
  };

  useEffect(() => {
    setExpenseComplete(props.expense.completed);

    if (props.expense.payee === currentUser.email) {
      setIsPayee(true);

      let calcOwed = 0;
      let payers = props.expense.payers;

      if (props.expense.completed) {
        calcOwed = parseFloat(props.expense.amount);
      } else {
        for (let i = 0; i < payers.length; i++) {
          if (payers[i].paid === true) {
            calcOwed += parseFloat(payers[i].amount);
          }
        }
      }

      setPaid(calcOwed);
    } else {
      let calcDebt = 0;
      let calcPaid = false;
      let payers = props.expense.payers;

      for (let i = 0; i < payers.length; i++) {
        if (payers[i].email === currentUser.email) {
          calcDebt += parseFloat(payers[i].amount);
          calcPaid = payers[i].paid;
        }
      }

      setDebt(calcDebt);
      setHasPaid(calcPaid);
    }
  }, [props.expense, currentUser.email]);

  return (
    <div
      className={`flex flex-row mt-2 py-2 ${
        expenseComplete ? "bg-primary-100" : "bg-white"
      } rounded-lg items-center px-2 md:px-4 shadow-md`}
    >
      <DeleteExpenseModal
        show={showDeleteExpense}
        onHide={() => setShowDeleteExpense(false)}
        deleteExpenseButton={props.deleteExpenseButton}
      />
      <span className="cursor-pointer" onClick={props.toggleExpenseButton}>
        {expenseComplete ? (
          <AiFillCheckCircle size="1.25em" color="#1F8FFF" />
        ) : (
          <AiOutlineCheckCircle size="1.25em" />
        )}
      </span>

      <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-start items-center md:justify-between w-full mr-1 md:mr-8">
        <text className="font-title font-semibold text-sm pl-2 md:ml-2">
          {isPayee ? "You" : getName(props.expense.payee).split(" ")[0]} lent{" "}
          <text className="text-primary-600">${props.expense.amount}</text>
        </text>

        <text
          className={`font-regular text-sm pl-2 ${
            (expenseComplete || hasPaid) && "line-through"
          }`}
        >
          {props.expense.description}
        </text>

        {isPayee ? (
          <text
            className={`font-title font-semibold text-sm ${
              expenseComplete || hasPaid
                ? " text-green-500 line-through"
                : "text-red-500"
            }`}
          >
            You've recevied ${paid.toFixed(2)}/{props.expense.amount}
          </text>
        ) : (
          <text
            className={`font-title font-semibold text-sm break-words ${
              expenseComplete || hasPaid
                ? " text-green-500 line-through"
                : "text-red-500"
            }`}
          >
            {expenseComplete || hasPaid ? "You paid " : "You owe "}$
            {debt.toFixed(2)}
          </text>
        )}
      </div>
      <Button
        type="primary"
        size="md"
        className="py-1 px-2 items-center"
        onClick={() => setShowDeleteExpense(true)}
      >
        <IoMdClose size="1.25em" />
      </Button>
    </div>
  );
}
