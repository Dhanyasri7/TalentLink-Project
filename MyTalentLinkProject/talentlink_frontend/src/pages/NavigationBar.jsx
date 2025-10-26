import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/NavigationBar.module.css";

// 🆕 Import Theme Toggle
import ThemeToggle from "../theme/ThemeToggle";

function NavigationBar() {
  const navigate = useNavigate();

  // State to store role
  const [isFreelancer, setIsFreelancer] = useState(false);

  // Detect role on mount
  useEffect(() => {
    setIsFreelancer(localStorage.getItem("is_freelancer") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_freelancer");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Left side: Title */}
      <h2 className={styles.navTitle}>{isFreelancer ? "Freelancer" : "Client"} Menu</h2>

      {/* Center: Links */}
      <div className={styles.navLinks}>
        {/* Dashboard */}
        <Link
          to={isFreelancer ? "/freelancerdashboard" : "/dashboard"}
          className={`${styles.navLink} ${styles.dashboardBtn}`}
        >
          Dashboard
        </Link>

        {/* Profile */}
        <Link
          to={isFreelancer ? "/freelancer/profile" : "/client/profile"}
          className={`${styles.navLink} ${styles.profileBtn}`}
        >
          Profile
        </Link>

        {/* Role-specific links */}
        {isFreelancer ? (
          <Link
            to="/find-projects"
            className={`${styles.navLink} ${styles.findProjectsBtn}`}
          >
            Find Projects
          </Link>
        ) : (
          <Link
            to="/find-freelancers"
            className={`${styles.navLink} ${styles.findProjectsBtn}`}
          >
            Find Freelancers
          </Link>
        )}

        {/* Common links */}
        <Link
          to="/contracts"
          className={`${styles.navLink} ${styles.contractsBtn}`}
        >
          Contracts
        </Link>
        <Link
          to="/messages"
          className={`${styles.navLink} ${styles.messagesBtn}`}
        >
          Messages
        </Link>
      </div>

      {/* Right side: Theme toggle + Logout */}
      <div className={styles.navRight}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`${styles.navButton} ${styles.logoutBtn}`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavigationBar;
