import React, { useRef, useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import houseLogo from "../../assets/logo_house.png";
import Button from "../../components/Button";

export default function ForgotPassword() {
  const emailRef = useRef();

  const { resetPassword } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center px-4 py-3 ">
        <div className="flex flex-row items-center mb-4 lg:mb-0">
          <button onClick={() => history.push("./")}>
            <img alt="logo" className="w-16 xl:w-14" src={houseLogo} />
          </button>
          <text className="font-title font-semibold text-black ml-3 text-3xl ">
            my<text className="text-primary-600">HouseKeeper</text>
          </text>
        </div>

        <text className="font-title font-semibold text-3xl text-center self-start">
          Housekeeping made
          <text className="text-primary-600"> simple and managable</text>
        </text>
      </div>

      <div className="flex flex-col justify-center self-center items-center mt-8 lg:mt-0 mb-8">
        <Card className="border-gray-200 border w-80 lg:w-96 p-2 rounded-lg shadow-md">
          <Card.Body className="font-title">
            <text className="font-title font-semibold text-2xl text-center text-primary-600">
              Forgot <text className="text-black">password</text>
            </text>

            {error && (
              <Alert className="font-regular mt-4" variant="danger">
                {error}
              </Alert>
            )}

            {message && (
              <Alert className="font-regular mt-4" variant="success">
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 mt-3" id="email">
                <text className="text-md font-semibold">Email</text>
                <Form.Control
                  className="font-regular mt-2"
                  ref={emailRef}
                  required
                />
              </Form.Group>

              <Button
                className="py-2 px-4 w-full mt-2"
                disabled={loading}
                type="primary"
              >
                Reset password
              </Button>
            </Form>
            <div className="font-regular w-100 text-center mt-2">
              <Link to="/login">Login</Link>
            </div>
            <div className="font-regular w-100 text-center mt-1">
              Need an account? <Link to="/signup">Sign up</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
