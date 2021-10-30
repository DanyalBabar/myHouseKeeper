import React, { useRef, useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/Button";
import houseLogo from "../assets/logo_house.png";

import { GoChecklist } from "react-icons/go";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoIosCopy, IoMdClose, IoMdAddCircle } from "react-icons/io";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("./");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between items-center px-4 py-3 space-y-4 xl:space-y-0">
        <div className="flex flex-row items-center ">
          <img className="w-16 xl:w-14" src={houseLogo} />
          <text className="font-title font-semibold text-black ml-3 text-3xl ">
            my<text className="text-primary-600">HouseKeeper</text>
          </text>
        </div>

        <div className="text-center break-normal">
          <text className="font-title font-semibold text-3xl ">
            Housekeeping made
            <text className="text-primary-600"> simple and managable</text>
          </text>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-center min-w-full px-4 xl:p-8 ">
        <div className="w-full xl:mr-8 ">
          <div className="flex flex-row rounded-xl  bg-primary-600 mt-4 p-3 shadow-md items-center">
            <div className="bg-white text-primary-600 p-2 rounded-xl justify-center items-center">
              <GoChecklist size="3em" />
            </div>

            <div className="flex flex-col ml-5">
              <text className="font-title font-semibold text-xl text-white">
                Manage chores
              </text>

              <text className="font-regular text-md mt-1 text-white">
                Record chores as needed that automatically rotate. Choose who's
                involved and how often the chore rotates.
              </text>
            </div>
          </div>

          <div className="flex flex-row rounded-xl  bg-primary-600 mt-4 p-3 shadow-md items-center">
            <div className="bg-white text-primary-600 p-2 rounded-xl justify-center items-center">
              <FaFileInvoiceDollar size="3em" />
            </div>

            <div className="flex flex-col ml-5">
              <text className="font-title font-semibold text-xl text-white">
                Track expenses
              </text>

              <text className="font-regular text-md mt-1 text-white">
                Automatically split expenses and keep track of how much money
                you're still owed.
              </text>
            </div>
          </div>

          <div className="flex flex-row rounded-xl  bg-primary-600 mt-4 p-3 shadow-md items-center">
            <div className="bg-white text-primary-600 p-2 rounded-xl justify-center items-center">
              <HiUserGroup size="3em" />
            </div>

            <div className="flex flex-col ml-5">
              <text className="font-title font-semibold text-xl text-white">
                Organize groups
              </text>

              <text className="font-regular text-md mt-1 text-white">
                Create a group within a few clicks and invite new housemates
                with codes or by email.
              </text>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center self-center mt-8 xl:mt-0 ">
          <Card className="border-gray-200 border w-80 h-96 p-2 rounded-lg shadow-md">
            <Card.Body className="font-title">
              <text className="fo-title font-semibold text-2xl text-center text-primary-600">
                Log <text className="text-black">In</text>
              </text>

              {error && (
                <Alert className="font-regular mt-4" variant="danger">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 mt-3" id="email">
                  <text className="text-md font-semibold">Email</text>
                  <Form.Control
                    className="font-regular mt-1"
                    type="email"
                    ref={emailRef}
                    required
                  />
                </Form.Group>

                <Form.Group id="password">
                  <text className="text-md font-semibold">Password</text>
                  <Form.Control
                    className="font-regular mt-1"
                    type="password"
                    ref={passwordRef}
                    required
                  />
                </Form.Group>

                <Button
                  className="py-2 px-4 w-full mt-4"
                  disabled={loading}
                  type="primary"
                >
                  Log In
                </Button>
              </Form>
              <div className="w-100 text-center mt-4 font-regular">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="w-100 text-center mt-2 font-regular">
                Need an account? <Link to="/signup">Sign Up</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="px-4 w-full mb-8 mt-8 xl:mt-0">
        <div class="text-center my-4 xl:mt-0">
          <text className="font-title font-semibold text-3xl">
            Getting started is
            <text className="text-primary-600"> easy</text>
          </text>
        </div>

        <div className="flex flex-col xl:flex-row items-center xl:items-start xl:justify-between">
          {/* CREATE */}
          <div className="flex flex-col xl:flex-row items-center my-4 xl:my-0 ">
            <div className="font-title font-bold text-2xl text-white rounded-lg py-2 px-3 w-80 xl:w-min h-12 text-center bg-primary-600 xl:mr-4 xl:self-start xl:mt-8">
              <text>1</text>
            </div>

            <div className="flex flex-col w-80 xl:w-96 h-50 rounded-lg bg-white border-gray-200 border shadow-md py-4 px-4 mt-8">
              <text className="font-title font-semibold text-xl ml-1 mb-3">
                Create a <text className="text-primary-600">house</text>
              </text>

              <text className="font-title font-semibold text-md mb-2 ml-1">
                House name
              </text>

              <input
                disabled={true}
                className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
                id="houseName"
                type="text"
                value="My new house"
              ></input>

              <div className="w-full flex flex-row justify-end mt-2">
                <Button
                  type="primary"
                  size="lg"
                  className={"my-2 py-1 px-3 mx-2"}
                >
                  Create house
                </Button>
              </div>
            </div>
          </div>

          {/* INVITE */}
          <div className="flex flex-col xl:flex-row items-center my-4 xl:my-0">
            <div className="font-title font-bold text-2xl text-white rounded-lg py-2 px-3 w-80 xl:w-min h-12 text-center bg-primary-600 xl:mr-4 xl:self-start xl:mt-8">
              <text>2</text>
            </div>
            <div className="flex flex-col w-80 h-80 xl:w-96 rounded-lg bg-white border-gray-200 border shadow-md p-4 m-4 mt-8">
              <text className="font-title font-semibold text-xl ml-1 mb-3">
                <text className="text-primary-600">Invite</text> your housemates
              </text>

              <div className="flex flex-row justify-between">
                <text className="font-title font-semibold text-md mb-2 ml-1">
                  House code
                </text>
              </div>

              <div className="rounded-md flex flex-row justify-between bg-gray-100 border-gray-200 border-1">
                <div className=" h-full p-2">
                  <text className="font-regular">xxxx-xxxx-xxxx-xxxx-xxxx</text>
                </div>
                <button className="px-1 border-gray-200 border-l-2 hover:bg-gray-50 focus:bg-gray-200">
                  <IoIosCopy size="2em" />
                </button>
              </div>

              {/* INVITE EMAIL */}
              <div className="flex flex-row justify-between  mt-3">
                <text className="font-title font-semibold text-md mb-2 ml-1">
                  Send invite link
                </text>
              </div>
              <input
                disabled={true}
                className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
                id="inviteEmail"
                type="text"
                value={"myroommate@example.com"}
              ></input>

              <div className="w-full flex flex-row justify-end mt-2">
                <Button
                  type="primary"
                  size="lg"
                  className="my-2 py-1 px-3 mx-2"
                >
                  Invite
                </Button>
              </div>
            </div>
          </div>

          {/* TRACK */}
          <div className="flex flex-col xl:flex-row items-center my-4 xl:my-0">
            <div className="font-title font-bold text-2xl text-white rounded-lg py-2 px-3 w-80 xl:w-min h-12 text-center bg-primary-600 xl:mr-4 xl:self-start xl:mt-8">
              <text>3</text>
            </div>
            <div className="flex flex-col w-80 xl:w-full rounded-lg bg-white border-gray-200 border shadow-md p-4 my-4 mt-8">
              <text className="font-title font-semibold text-xl ml-1 mb-3">
                Start <text className="text-primary-600">housekeeping</text>
              </text>

              <div className="bg-primary-300 backdrop-brightness-75 rounded-lg mb-3 border border-gray-200">
                {/* CHORE HEADER */}
                <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-4 justify-between shadow-md">
                  <text className="font-title tracking-tight text-white text-lg">
                    Chores
                  </text>
                  <Button
                    type="secondary"
                    size="md"
                    className="my-2 py-1 px-2 justify-between flex flex-rowF items-center"
                  >
                    <IoMdAddCircle size="1.25em" />
                  </Button>
                </div>

                {/* CHORE 1 */}
                <div className="flex flex-row py-2 mt-2 bg-white rounded-lg items-center px-2 md:px-4 shadow-md ">
                  <span>
                    <AiOutlineCheckCircle size="1.25em" />
                  </span>

                  <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-start items-center md:justify-between w-full mr-2 md:mr-8 ">
                    <text className="font-title font-semibold text-sm pl-2 md:ml-2">
                      John&emsp;
                      <text className="text-primary-600">Daily</text>
                    </text>

                    <text className="font-regular text-sm pl-2">
                      Wash the dishes
                    </text>

                    <text className="font-title font-semibold text-sm pl-2">
                      Oct 29, 2021
                    </text>
                  </div>
                  <Button
                    type="primary"
                    size="md"
                    className="py-1 px-2 items-center"
                  >
                    <IoMdClose size="1.25em" />
                  </Button>
                </div>

                {/* CHORE 2 */}
                <div className="flex flex-row py-2 mt-2 bg-white rounded-lg items-center px-2 md:px-4 shadow-md ">
                  <span>
                    <AiFillCheckCircle size="1.25em" color="#1F8FFF" />
                  </span>

                  <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-start items-center md:justify-between w-full mr-2 md:mr-8 ">
                    <text className="font-title font-semibold text-sm pl-2 md:ml-2">
                      Me&emsp;
                      <text className="text-primary-600">Monthly</text>
                    </text>

                    <text className="font-regular text-sm pl-2 line-through">
                      Pay hydro bill
                    </text>

                    <text className="font-title font-semibold text-sm pl-2">
                      Nov 1, 2021
                    </text>
                  </div>
                  <Button
                    type="primary"
                    size="md"
                    className="py-1 px-2 items-center"
                  >
                    <IoMdClose size="1.25em" />
                  </Button>
                </div>
              </div>

              <div className="bg-primary-300 backdrop-brightness-75 rounded-lg mb-3 border border-gray-200">
                {/* EXPENSE HEADER */}
                <div className="flex flex-row bg-primary-600 rounded-lg items-center px-2 md:px-4 justify-between shadow-md">
                  <text className="font-title tracking-tight text-white text-lg">
                    Expenses
                  </text>
                  <Button
                    type="secondary"
                    size="md"
                    className="my-2 py-1 px-2 justify-between flex flex-rowF items-center"
                  >
                    <IoMdAddCircle size="1.25em" />
                  </Button>
                </div>

                {/* EXPENSE 1 */}
                <div className="flex flex-row py-2 mt-2 bg-white rounded-lg items-center px-2 md:px-4 shadow-md ">
                  <span>
                    <AiOutlineCheckCircle size="1.25em" />
                  </span>

                  <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-between items-center md:justify-between w-full mr-1 md:mr-4">
                    <text className="font-title font-semibold text-sm pl-2 md:ml-2">
                      You lent <text className="text-primary-600">$15.00</text>
                    </text>

                    <text className="font-regular text-sm pl-2">Uber eats</text>

                    <text className="font-title font-semibold text-sm text-center xl:text-justify text-red-500">
                      You've recevied $7.50/15.00
                    </text>
                  </div>
                  <Button
                    type="primary"
                    size="md"
                    className="py-1 px-2 items-center"
                  >
                    <IoMdClose size="1.25em" />
                  </Button>
                </div>

                {/* EXPENSE 2 */}
                <div className="flex flex-row py-2 mt-2 bg-white rounded-lg items-center px-2 md:px-4 shadow-md ">
                  <span>
                    <AiFillCheckCircle size="1.25em" color="#1F8FFF" />
                  </span>

                  <div className="flex flex-col md:flex-row ml-1 md:ml-0 justify-between items-center md:justify-between w-full mr-1 md:mr-4">
                    <text className="font-title font-semibold text-sm pl-2 md:ml-2">
                      Maria lent{" "}
                      <text className="text-primary-600">$24.50</text>
                    </text>

                    <text className="font-regular text-sm pl-2 line-through">
                      Textbooks
                    </text>

                    <text className="font-title font-semibold text-sm text-center xl:text-justify text-green-500 line-through">
                      You've paid $12.25
                    </text>
                  </div>
                  <Button
                    type="primary"
                    size="md"
                    className="py-1 px-2 items-center"
                  >
                    <IoMdClose size="1.25em" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
