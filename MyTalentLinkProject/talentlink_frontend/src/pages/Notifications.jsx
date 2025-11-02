import React, { useEffect, useState } from "react";
import API from "../api";
import NavigationBar from "./NavigationBar";
import styles from "../styles/Notifications.module.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 👈 for client/freelancer
  const [marking, setMarking] = useState(null);

  // ✅ Fetch current user (to check role)
  const fetchUser = async () => {
    try {
      const res = await API.get("users/me/");
      setUserRole(res.data.role); // assuming your User model has 'role' field
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
    }
  };

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
      alert("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark notification as read
  const markAsRead = async (id) => {
    try {
      setMarking(id);
      await API.post(`notifications/${id}/mark_as_read/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    } finally {
      setMarking(null);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, []);

  if (loading) return <p className={styles.loading}>Loading notifications...</p>;

  // ✅ Filter notifications based on login type
  const filteredNotifications =
    userRole === "client"
      ? notifications.filter((n) => n.message.includes("contract") || n.message.includes("freelancer"))
      : userRole === "freelancer"
      ? notifications.filter((n) => n.message.includes("client"))
      : notifications;

  return (
    <div className={styles.pageWrapper}>
      <nav>
        <NavigationBar />
      </nav>

      <div className={styles.content}>
        <h1>Notifications</h1>

        {filteredNotifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <div className={styles.list}>
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.card} ${
                  notif.is_read ? styles.read : styles.unread
                }`}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
              >
                <p className={styles.message}>
                  {notif.message}
                </p>
                <p className={styles.time}>
                  {new Date(notif.created_at).toLocaleString()}
                </p>

                {!notif.is_read && (
                  <button
                    className={styles.markBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                    disabled={marking === notif.id}
                  >
                    {marking === notif.id ? "Updating..." : "Mark as Read"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
