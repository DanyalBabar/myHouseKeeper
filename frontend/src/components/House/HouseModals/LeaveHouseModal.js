import React, { useState, useRef } from "react";
import { Modal, ModalBody, ModalDialog } from "react-bootstrap";
import Button from "../../Button";
import LoadOverlay from "../../LoadOverlay";

export default function LeaveHouseModal(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    await props
      .handleSubmit()
      .then(() => {
        setError("");
        setLoading(false);
        props.onHide();
      })
      .catch(() => {
        setError("Unable to leave house.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      {loading && <LoadOverlay />}
      <ModalBody>
        <div className="flex flex-col">
          <text className="font-title font-semibold text-xl ml-1 mb-3">
            Leave <text className="text-primary-600">{props.houseName}?</text>
          </text>

          <text className="font-regular text-md mb-2 ml-1">
            You cannot undo this action. You can join this house again using the
            house code.
          </text>

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
              Cancel
            </Button>

            <Button
              type="primary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2"}
              onClick={() => handleSubmit()}
            >
              Leave house
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
