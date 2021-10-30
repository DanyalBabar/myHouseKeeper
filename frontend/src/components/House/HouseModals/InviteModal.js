import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalDialog } from "react-bootstrap";
import Button from "../../Button";
import LoadOverlay from "../../LoadOverlay";
import { IoIosCopy } from "react-icons/io";

export default function InviteModal(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDisabled, setInviteDisabled] = useState(true);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      props.handleSubmit(inviteEmail);
      setError("");
      setLoading(false);
      setInviteSuccess(true);
    } catch {
      setError("Unable to send invite.");
    } finally {
      setLoading(false);
    }
  }

  const onChangeEmail = (e) => {
    let email = e.currentTarget.value;
    setInviteEmail(email);

    if (validateEmail(email)) {
      setInviteDisabled(false);
    } else {
      setInviteDisabled(true);
    }
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  useEffect(() => {
    if (props.show === false) {
      setError("");
      setCopied(false);
      setInviteSuccess(false);
      setInviteEmail("");
    }
  }, [props.show]);

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      {loading && <LoadOverlay />}
      <ModalBody>
        <div className="flex flex-col">
          <text className="font-title font-semibold text-xl ml-1 mb-3">
            <text className="text-primary-600">Invite</text> a housemate
          </text>

          <div className="flex flex-row justify-between">
            <text className="font-title font-semibold text-md mb-2 ml-1">
              House code
            </text>

            <text className="font-regular font-semibold text-md text-primary-600">
              {copied && "Copied!"}
            </text>
          </div>

          <div className="rounded-md flex flex-row justify-between bg-gray-100 border-gray-200 border-1">
            <div className=" h-full p-2">
              <text className="font-regular">{props.code}</text>
            </div>
            <button
              className="px-1 border-gray-200 border-l-2 hover:bg-gray-50 focus:bg-gray-200"
              onClick={() => {
                navigator.clipboard.writeText(props.code);
                setCopied(true);
              }}
            >
              <IoIosCopy size="2em" />
            </button>
          </div>

          {/* INVITE EMAIL */}
          <div className="flex flex-row justify-between mt-3">
            <text className="font-title font-semibold text-md mb-2 ml-1">
              Send invite link
            </text>

            <text className="font-regular font-semibold text-md text-primary-600">
              {inviteSuccess && "Invite sent!"}
            </text>
          </div>
          <input
            disabled={loading === true}
            className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
            id="inviteEmail"
            type="text"
            placeholder="roommate@example.com"
            onChange={onChangeEmail}
            value={inviteEmail}
          ></input>

          {error && (
            <text className="font-title font-semibold text-center text-red-500 text-md ">
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
              Close
            </Button>

            <Button
              disabled={inviteDisabled}
              type="primary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2"}
              onClick={() => handleSubmit()}
            >
              Invite
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
