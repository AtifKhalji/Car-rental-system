import { useCallback, useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  getAllBookings,
  getComplaints
} from "../services/api";
import { useNavigate } from "react-router-dom";

const adminBackgroundImage =
  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=2200&q=80";

const pageStyles = `
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .admin-content {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 1000px) {
    .admin-stats,
    .admin-content {
      grid-template-columns: 1fr;
    }
  }
`;

const panelStyle = {
  background: "rgba(2, 6, 23, 0.94)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  borderRadius: "10px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
};

const buttonStyle = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      localStorage.clear();
      navigate("/");
      return;
    }

    try {
      const [u, b, c] = await Promise.all([
        getAllUsers(),
        getAllBookings(),
        getComplaints()
      ]);

      setUsers(u.data);
      setBookings(b.data);
      setComplaints(c.data);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      alert("Failed to load admin data. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (user) => {
    if (user.role === "admin") return alert("Admin users cannot be deleted");

    try {
      await deleteUser(user.email);
      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.email !== user.email)
      );
    } catch (err) {
      if (err.response?.status === 403) {
        return alert("Admin users cannot be deleted");
      }

      alert("Failed to delete user");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const customerCount = users.filter((user) => user.role === "customer").length;
  const ownerCount = users.filter((user) => user.role === "owner").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "28px",
        color: "white",
        background: `
          linear-gradient(rgba(2, 6, 23, 0.88), rgba(15, 23, 42, 0.93)),
          url(${adminBackgroundImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{pageStyles}</style>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "26px"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "48px" }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: "8px 0 0", color: "#cbd5e1" }}>
            Monitor users, bookings, and complaints from one place.
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            background: "#ef4444",
            minWidth: "100px"
          }}
        >
          Logout
        </button>
      </header>

      <section className="admin-stats" style={{ marginBottom: "24px" }}>
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Customers" value={customerCount} />
        <StatCard label="Owners" value={ownerCount} />
      </section>

      <section className="admin-content">
        <div style={{ display: "grid", gap: "24px" }}>
          <Panel title="Users" subtitle="Review users and remove non-admin accounts.">
            {loading ? (
              <EmptyText>Loading users...</EmptyText>
            ) : users.length === 0 ? (
              <EmptyText>No users registered yet.</EmptyText>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {users.map((user) => (
                  <div
                    key={user.email}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px",
                      background: "#030712",
                      borderRadius: "8px"
                    }}
                  >
                    <div>
                      <strong>{user.name || "Unnamed user"}</strong>
                      <p style={{ margin: "4px 0 0", color: "#94a3b8" }}>
                        {user.email} - {user.role}
                      </p>
                    </div>

                    {user.role === "admin" ? (
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        style={{
                          ...buttonStyle,
                          background: "#ef4444"
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Bookings" subtitle="Latest customer rental activity.">
            {loading ? (
              <EmptyText>Loading bookings...</EmptyText>
            ) : bookings.length === 0 ? (
              <EmptyText>No bookings found.</EmptyText>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      padding: "14px",
                      background: "#030712",
                      borderRadius: "8px"
                    }}
                  >
                    <strong>{booking.brand}</strong>
                    <p style={{ margin: "6px 0", color: "#cbd5e1" }}>
                      {booking.from} to {booking.to}
                    </p>
                    <p style={{ margin: 0, color: "#22c55e", fontWeight: "bold" }}>
                      Rs {booking.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Complaints" subtitle="Messages submitted by customers and owners.">
          {loading ? (
            <EmptyText>Loading complaints...</EmptyText>
          ) : complaints.length === 0 ? (
            <EmptyText>No complaints submitted.</EmptyText>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  style={{
                    padding: "14px",
                    background: "#030712",
                    borderRadius: "8px"
                  }}
                >
                  <p style={{ margin: 0 }}>{complaint.message}</p>
                  <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                    From: {complaint.user || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        ...panelStyle,
        padding: "22px"
      }}
    >
      <p style={{ margin: 0, color: "#94a3b8" }}>{label}</p>
      <h2 style={{ margin: "8px 0 0", fontSize: "34px" }}>{value}</h2>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section
      style={{
        ...panelStyle,
        padding: "22px"
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: "6px 0 18px", color: "#94a3b8" }}>
        {subtitle}
      </p>
      {children}
    </section>
  );
}

function EmptyText({ children }) {
  return (
    <div
      style={{
        padding: "28px",
        textAlign: "center",
        color: "#cbd5e1",
        background: "#030712",
        borderRadius: "8px"
      }}
    >
      {children}
    </div>
  );
}
