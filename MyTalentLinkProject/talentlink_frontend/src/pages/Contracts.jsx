import React, { useEffect, useState } from "react";
import API from "../api.js";
import NavigationBar from "./NavigationBar";
import styles from "../styles/Contracts.module.css";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // ✅ Fetch all contracts
  const fetchContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch contracts:", err);
      alert("Failed to load contracts. Please ensure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark contract as completed
  const markAsCompleted = async (id) => {
    if (!window.confirm("Are you sure you want to mark this contract as completed?")) return;

    setUpdating(id);
    try {
      // ✅ Use PUT since PATCH is not allowed
      const response = await API.put(`contracts/${id}/mark_completed/`);
      console.log("✅ Contract marked as completed:", response.data);

      // ✅ Update local state immediately
      setContracts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Completed" } : c
        )
      );

      alert("✅ Contract marked as completed successfully!");
    } catch (err) {
      console.error("❌ Failed to update contract:", err);
      console.error("Server response:", err.response?.data);

      const { status, data } = err.response || {};
      if (data?.detail === "Contract already completed.") {
        alert("⚠️ This contract is already marked as completed.");
      } else if (status === 401) {
        alert("Unauthorized: Please log in again.");
      } else if (status === 404) {
        alert("Contract not found.");
      } else {
        alert(`❌ ${data?.detail || "Failed to update contract."}`);
      }
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) return <p className={styles.loading}>Loading contracts...</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <nav>
        <NavigationBar />
      </nav>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Contracts</h1>

        {contracts.length === 0 ? (
          <p>No contracts found.</p>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className={styles.card}>
              <p>
                <strong>Project:</strong>{" "}
                {contract.project_title || "N/A"}
              </p>
              <p>
                <strong>Freelancer:</strong>{" "}
                {contract.freelancer_name || "N/A"}
              </p>
              <p>
                <strong>Client:</strong>{" "}
                {contract.client_name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    contract.status === "Completed"
                      ? styles.completed
                      : styles.active
                  }
                >
                  {contract.status || "N/A"}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> ₹{contract.payment_amount || "0"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {contract.created_at
                  ? new Date(contract.created_at).toLocaleString()
                  : "N/A"}
              </p>

              {/* ✅ Show button only if not completed */}
              {contract.status !== "Completed" && (
                <button
                  className={styles.completeBtn}
                  onClick={() => markAsCompleted(contract.id)}
                  disabled={updating === contract.id}
                >
                  {updating === contract.id ? "Updating..." : "Mark as Completed"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contracts;
