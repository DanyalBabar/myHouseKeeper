import { Spinner } from "react-bootstrap";
import "./LoadOverlay.css";
import React from "react";

export default function LoadOverlay() {
  return (
    <div className="absolute min-w-full min-h-full bg-black bg-opacity-25 z-50">
      <div className="absolute spinner top-1/2 left-1/2">
        <Spinner size="md" animation="border" role="status"></Spinner>
      </div>
    </div>
  );
}
