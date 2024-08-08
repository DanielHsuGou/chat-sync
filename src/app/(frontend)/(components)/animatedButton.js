import React from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./animatedButton.css";

const AnimatedButton = () => {
  return (
    <div className={`${styles.animatedButton}`}>
      <FaTrash className={styles.icon} />
    </div>
  );
};

export default AnimatedButton;
