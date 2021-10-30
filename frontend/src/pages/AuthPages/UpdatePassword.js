import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { passwordCheck } from "../../utilities/StrongPassword";

export default function UpdatePassword() {
  const blackColor = "#212529";

  const oldPassword = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { currentUser, updatePassword, reauthenticate } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    try {
      passwordCheck(passwordRef.current.value);
    } catch (err) {
      setLoading(false);
      setError(err.message);

      console.log(error);
      return;
    }

    reauthenticate(currentUser.email, oldPassword.current.value)
      .then(() => {
        console.log("got it");

        updatePassword(passwordRef.current.value)
          .then(() => {
            oldPassword.current.value = "";
            passwordRef.current.value = "";
            passwordConfirmRef.current.value = "";
            setSuccess("Password Successfully changed");
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
          });
      })
      .catch((err) => {
        setError("Current password is incorrect");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyItems: "center",
          marginTop: "50px",
        }}
      >
        <Card style={{ borderWidth: 2, width: "350px" }}>
          <Card.Body>
            <div
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-end",
                marginBottom: "15px",
              }}
            >
              <text
                className="titleText"
                style={{
                  fontSize: "25px",
                }}
              >
                Change Password
              </text>

              <button
                onClick={() => history.push("/settings")}
                style={{
                  float: "right",
                  background: "transparent",
                  boxShadow: "0px 0px 0px transparent",
                  border: "0px solid transparent",
                  textShadow: " 0px 0px 0px transparent",
                }}
              >
                <FaArrowLeft color={blackColor} />
              </button>
            </div>

            {success && (
              <Alert variant="success" style={{}}>
                {`${success}`}
              </Alert>
            )}
            {error && (
              <Alert variant="danger">
                {error.split("\n").map((str) => (
                  <p>{str}</p>
                ))}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="oldPassword" style={{ marginBottom: "20px" }}>
                <text className="regText" style={{ fontSize: "20px" }}>
                  Current Password
                </text>
                <Form.Control
                  type="password"
                  ref={oldPassword}
                  required
                  placeholder="Enter your current password"
                />
              </Form.Group>

              <Form.Group id="password" style={{ marginBottom: "10px" }}>
                <text className="regText" style={{ fontSize: "20px" }}>
                  New Password
                </text>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Enter your new password"
                />
              </Form.Group>

              <Form.Group id="password-confirmation">
                <text className="regText" style={{ fontSize: "20px" }}>
                  Confirm New Password
                </text>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Re-enter your new password"
                />
              </Form.Group>

              <Button
                disabled={loading}
                className="w-100 mt-4 menuButton"
                type="submit"
                variant="dark"
              >
                Change Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
