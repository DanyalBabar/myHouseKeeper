import React, { useState, useRef } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Button from "../Button";
import LoadOverlay from "../LoadOverlay";

export default function CreateHouseModal(props) {
  const houseName = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(houseName) {
    setError("");
    setLoading(true);
    await props
      .onSubmit(houseName)
      .then(() => {
        props.onHide();
      })
      .catch(() => {
        setError("Could find house with such code.");
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
            Create a <text className="text-primary-600">house</text>
          </text>

          <text className="font-title font-semibold text-md mb-2 ml-1">
            House name
          </text>

          {error && (
            <text className="font-title font-semibold text-red-500 text-md mb-2 ml-1">
              {error}
            </text>
          )}

          <input
            disabled={loading === true}
            className="font-regular appearance-none border rounded-lg w-full py-2 px-3 focus:outline-none focus:shadow-outline"
            id="houseName"
            type="text"
            placeholder="My new house name"
            maxLength={36}
            ref={houseName}
          ></input>

          <div className="w-full flex flex-row justify-end mt-2">
            <Button
              type="secondary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2 border-1 border-gray-300"}
              onClick={() => {
                setError("");
                props.onHide();
              }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              size="lg"
              className={"my-2 py-1 px-3 mx-2"}
              onClick={() => handleSubmit(houseName.current.value)}
            >
              Create house
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
