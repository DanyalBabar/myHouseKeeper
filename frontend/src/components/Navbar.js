import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "../utilities/WindowDimensions.js";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import { Button, Media } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";

export default function Navbar(props) {
  const history = useHistory();
  const { height, width } = useWindowDimensions();
  const [navOpen, setNavOpen] = useState(false);
  async function handleLogout() {
    try {
      await props.logout();
      history.push("/login");
    } catch {
      console.error("Logout failed");
    }
  }

  useEffect(() => {
    if (width > 760) {
      setNavOpen(false);
    }
  }, [width]);

  return (
    <div className={navOpen ? "navbar active" : "navbar"}>
      {/* LOGO */}
      <div
        className="flex flex-row mb-6"
        // style={{
        //   flexDirection: "row",
        //   marginBottom: "25px",
        //   marginTop: "-15%",
        //   display: "flex",
        // }}
      >
        <div
          style={{
            marginTop: width < 760 ? "-5%" : "2%",
            marginRight: width < 760 ? "10px" : "",
          }}
        >
          <text
            style={{
              fontWeight: 200,
              fontSize: "25px",
              fontSmooth: "always",
            }}
          >
            Minimal
          </text>
          <text
            style={{
              fontWeight: 700,
              fontSize: "25px",
              fontSmooth: "always",
            }}
          >
            Network
          </text>
        </div>

        {width < 760 && (
          <>
            <button
              onClick={() => setNavOpen(!navOpen)}
              style={{
                flexDirection: "row",
                display: "flex",
                position: "absolute",
                right: 0,
                paddingRight: "15px",
                background: "transparent",
                boxShadow: "0px 0px 0px transparent",
                border: "0px solid transparent",
                textShadow: " 0px 0px 0px transparent",
              }}
            >
              {navOpen ? (
                <FaArrowLeft color="white" />
              ) : (
                <FaBars color="white" />
              )}
            </button>
          </>
        )}
      </div>

      {/* <Switch
        disabled={props.fb.token === ""}
        checked={props.fb.enabled}
        // onChange={() => props.toggleMedia("facebook")}
        color="primary"
        style={{
          color: props.fb.enabled ? "#4267B2" : "white",
        }}
      /> */}

      <div>
        <Button
          className="w-100 mt-4 navButton"
          type="submit"
          variant="light"
          onClick={() => history.push("/settings")}
        >
          Settings
        </Button>

        <Button
          className="w-100 mt-4 navButton"
          type="submit"
          variant="light"
          onClick={() => handleLogout()}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
