import React from "react";
import { FaTrash } from "react-icons/fa";
import "./animatedButton.css";

const AnimatedButton = () => {
  return (
    <div className="animated-button">
      <FaTrash className="icon" />
    </div>
  );
};

export default AnimatedButton;
