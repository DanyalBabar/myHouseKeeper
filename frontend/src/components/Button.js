import React from "react";

export default function Button(props) {
  const primary = `${
    !props.disabled
      ? "bg-primary-600 hover:bg-primary-500 focus:bg-primary-700 text-white"
      : "bg-primary-400 text-white"
  }`;
  const secondary = `${
    !props.disabled
      ? "bg-gray-50 hover:bg-gray-200 focus:bg-gray-300 text-black"
      : "bg-gray-100  text-black"
  }`;

  return (
    <button
      disabled={props.disabled}
      className={`
      ${props.type === "primary" ? primary : secondary} font-regular 
      ${props.size === "sm" && "text-sm"}
      ${props.size === "md" && "text-md"}
      ${props.size === "lg" && "text-lg"}
      ${(props.size !== "sm", "md", "lg" && "text-md")}

       justify-between rounded-lg 
       ${props.className}`}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
