import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { passwordCheck } from "../../utilities/StrongPassword";
import { auth } from "../../firebase";
import HouseDataService from "../../services/houses";
import UserDataService from "../../services/user";
import houseLogo from "../../assets/logo_house.png";
import Button from "../../components/Button";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const { signup, fetchSignInMethodsForEmail } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [referralHouse, setReferralHouse] = useState("");

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let continueFunction = true;
    setError("");
    setLoading(true);

    if (validateEmail(emailRef.current.value) === false) {
      setLoading(false);
      setError("The email address is badly formatted.");
      continueFunction = false;
    }

    fetchSignInMethodsForEmail(emailRef.current.value)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          setError("The email address is already in use by another account.");
          continueFunction = false;
        }
      })
      .catch((err) => {
        setError(err.message);
        continueFunction = false;
      })
      .finally(() => {
        setLoading(false);
      });

    if (continueFunction) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        setLoading(false);
        setError("Passwords do not match");
        continueFunction = false;
      }
    }

    if (continueFunction) {
      try {
        passwordCheck(passwordRef.current.value);
      } catch (err) {
        setLoading(false);
        setError(err.message);
        continueFunction = false;
      }
    }

    const newDisplayName =
      firstNameRef.current.value + " " + lastNameRef.current.value;

    if (continueFunction) {
      signup(emailRef.current.value, passwordRef.current.value)
        .then(async () => {
          auth.currentUser
            .updateProfile({
              displayName: newDisplayName,
            })
            .then(async () => {
              await UserDataService.createUser(
                auth.currentUser.uid,
                auth.currentUser.displayName,
                auth.currentUser.email
              );

              if (referralHouse) {
                await HouseDataService.modifyMembers(
                  referralHouse.houseID,
                  referralHouse.members,
                  newDisplayName,
                  emailRef.current.value,
                  "false"
                );

                await UserDataService.modifyUser(
                  auth.currentUser.uid,
                  [],
                  referralHouse.houseID,
                  "true",
                  "false"
                );
              }

              history.push("./");
            });
        })
        .catch((e) => {
          setError("Failed to create account");
        });
    }
  }

  useEffect(async () => {
    if (auth.currentUser) {
      history.push("./");
    } else {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if ("code" in params) {
        const code = params.code;

        const resp = await HouseDataService.getHouse("", code);
        const house = resp.data.house;

        if (house) {
          setReferralHouse(house);
        }
      }
    }
  }, []);

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between items-center px-4 py-3 space-y-4 xl:space-y-0">
        <div className="flex flex-row items-center ">
          <button onClick={() => history.push("./")}>
            <img className="w-16 xl:w-14" src={houseLogo} />
          </button>
          <text className="font-title font-semibold text-black ml-3 text-3xl ">
            my<text className="text-primary-600">HouseKeeper</text>
          </text>
        </div>

        <div className="text-center break-normal">
          <text className="font-title font-semibold text-3xl ">
            Housekeeping made
            <text className="text-primary-600"> simple and manageable</text>
          </text>
        </div>
      </div>

      <div className="flex flex-col justify-center self-center items-center mt-8 lg:mt-0 mb-8">
        <Card className="border-gray-200 border w-80 lg:w-96 p-2 rounded-lg shadow-md">
          <Card.Body className="font-title">
            <text className="font-title font-semibold text-2xl text-center text-primary-600">
              Sign <text className="text-black">up</text>
            </text>

            {error && (
              <Alert className="font-regular mt-4" variant="danger">
                {error.split("\n").map((str) => (
                  <p>{str}</p>
                ))}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 mt-3" id="email">
                <text className="text-md font-semibold">Email</text>
                <Form.Control
                  className="font-regular mt-1"
                  ref={emailRef}
                  required
                />
              </Form.Group>

              <Form.Group id="firstName" className="mb-3 mt-3">
                <text className="text-md font-semibold">First name</text>
                <Form.Control
                  className="font-regular mt-1"
                  ref={firstNameRef}
                  required
                />
              </Form.Group>

              <Form.Group id="lastName" className="mb-3 mt-3">
                <text className="text-md font-semibold">Last name</text>
                <Form.Control
                  className="font-regular mt-1"
                  ref={lastNameRef}
                  required
                />
              </Form.Group>

              <Form.Group id="password" className="mb-3 mt-3">
                <text className="text-md font-semibold">Password</text>
                <Form.Control
                  className="mt-1"
                  type="password"
                  ref={passwordRef}
                  required
                />
              </Form.Group>

              <Form.Group id="passwordConfirm" className="mt-3">
                <text className="text-md font-semibold">Confirm password</text>
                <Form.Control
                  className="mt-1"
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>

              <Button
                disabled={loading}
                className="py-2 px-4 w-full mt-4"
                type="primary"
              >
                Sign up
              </Button>
            </Form>
            <div className="font-regular w-100 text-center mt-2">
              <Link to="/login">Already have an account? Log In</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
