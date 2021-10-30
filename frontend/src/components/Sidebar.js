import React, { useState, useEffect } from "react";
import { FaHome, FaHammer } from "react-icons/fa";
import { BiLogOutCircle, BiMenu } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import houseLogo from "../assets/logo_house.png";

export default function Navbar(props) {
  const history = useHistory();
  async function handleLogout() {
    try {
      await props.logout();
      history.push("/login");
    } catch {
      console.error("Logout failed");
    }
  }

  const [navOpen, setNavOpen] = useState(false);

  const buttonStyles =
    "py-2.5 px-4 my-2 flex justify-between flex-row items-center";

  useEffect(() => {
    if (props.collapse === false) {
      setNavOpen(false);
    }
  }, [props.collapse]);

  return (
    <div
      className={`${props.className} absolute bg-white rounded-r-2xl px-4 pt-2 shadow-lg`}
      style={{
        minHeight: "100%",
        maxHeight: "100%",

        minWidth: props.collapse ? "350px" : "300px",
        maxWidth: props.collapse ? "350px" : "300px",

        marginLeft: props.collapse ? !navOpen && "-300px" : "0px",
        transition: "300ms ease",
      }}
    >
      <div
        style={{
          paddingRight: props.collapse ? "10px" : 0,
          marginRight: props.collapse ? "20px" : 0,
          transition: "300ms ease",
        }}
      >
        <div className="flex flex-col justify-between">
          <div className="flex flex-row items-center mb-2">
            <img className="w-14" src={houseLogo} />
            <text
              className="font-title font-semibold text-black ml-3"
              style={{ fontSize: "1.56em" }}
            >
              my<text className="text-primary-600">HouseKeeper</text>
            </text>
          </div>
          <Button
            className={buttonStyles}
            size="lg"
            type="primary"
            onClick={props.joinHouseButton}
          >
            Join a house
            <FaHome size="1.25em" />
          </Button>

          <Button
            className={buttonStyles}
            size="lg"
            type="primary"
            onClick={props.createHouseButton}
          >
            Create a house
            <FaHammer size="1.25em" />
          </Button>

          <Button
            className="self-end"
            size="lg"
            type="primary"
            className={buttonStyles}
            onClick={() => handleLogout()}
          >
            Log out
            <BiLogOutCircle size="1.25em" />
          </Button>
        </div>
      </div>
      {props.collapse && (
        <div
          className="float-right absolute top-0 right-0 pr-4 pt-1 "
          style={{
            transition: "300ms ease",
          }}
        >
          <button
            className="my-4 mt-3 flex justify-between flex-row items-center"
            onClick={() => setNavOpen(!navOpen)}
          >
            <BiMenu size="1.25em" />
          </button>
        </div>
      )}
    </div>
  );
}
