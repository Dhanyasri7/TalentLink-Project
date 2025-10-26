import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Welcome.module.css";

function Welcome() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to TalentLink</h1>
        <p className={styles.subtitle}>
          Connecting clients and freelancers effortlessly
        </p>
        <div className={styles.buttons}>
          <Link to="/login">
            <button className={styles.loginBtn}>Login</button>
          </Link>
          <Link to="/register">
            <button className={styles.registerBtn}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
