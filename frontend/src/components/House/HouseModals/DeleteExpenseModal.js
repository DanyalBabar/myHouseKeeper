import React, { useState, useRef } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Button from "../../Button";
import LoadOverlay from "../../LoadOverlay";

export default function DeleteExpenseModal(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      await props.deleteExpenseButton();
      setLoading(false);
      props.onHide();
      setError("");
    } catch {
      setError("Could not delete expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      {loading && <LoadOverlay />}
      <ModalBody>
        <div className="flex flex-col">
          <text className="font-title font-semibold text-xl ml-1 mb-3">
            Delete expense?
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
              Delete expense
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
