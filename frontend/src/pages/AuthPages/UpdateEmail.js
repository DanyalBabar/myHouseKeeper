import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function UpdateEmail() {
  const blackColor = "#212529";

  const currPassword = useRef();
  const newEmailRef = useRef();
  const confirmNewEmailRef = useRef();

  const {
    currentUser,
    updateEmail,
    reauthenticate,
    fetchSignInMethodsForEmail,
  } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (newEmailRef.current.value !== confirmNewEmailRef.current.value) {
      return setError("Emails do not match");
    }

    reauthenticate(currentUser.email, currPassword.current.value)
      .then(() => {
        console.log("got it");

        updateEmail(newEmailRef.current.value)
          .then(() => {
            currPassword.current.value = "";
            newEmailRef.current.value = "";
            confirmNewEmailRef.current.value = "";
            setSuccess("Email Successfully changed");
          })
          .catch((err) => {
            setError(err.message);
          });
      })
      .catch((err) => {
        setError("Password is incorrect");
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
                Change Email
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

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="currPassword" style={{ marginBottom: "20px" }}>
                <text className="regText" style={{ fontSize: "20px" }}>
                  Current Password
                </text>
                <Form.Control
                  type="password"
                  ref={currPassword}
                  required
                  placeholder="Enter your current password"
                />
              </Form.Group>

              <Form.Group id="password" style={{ marginBottom: "10px" }}>
                <text className="regText" style={{ fontSize: "20px" }}>
                  New Email
                </text>
                <Form.Control
                  type="email"
                  ref={newEmailRef}
                  placeholder="Enter your new email"
                />
              </Form.Group>

              <Form.Group id="password-confirmation">
                <text className="regText" style={{ fontSize: "20px" }}>
                  Confirm New Email
                </text>
                <Form.Control
                  type="email"
                  ref={confirmNewEmailRef}
                  placeholder="Re-enter your new email"
                />
              </Form.Group>

              <Button
                disabled={loading}
                className="w-100 mt-4 menuButton"
                type="submit"
                variant="dark"
              >
                Change Email
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
