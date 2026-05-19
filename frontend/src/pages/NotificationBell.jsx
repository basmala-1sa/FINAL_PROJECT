import { useState, useEffect, useRef } from "react";
import { FiBell, FiCheckCircle, FiXCircle, FiMail } from "react-icons/fi";

const colors = {
  navyDark:  "#112250",
  gold:      "#C2A072",
  lightGold: "#E0C58F",
  offWhite:  "#F5F0E9",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]                   = useState(false);
  const [unread, setUnread]               = useState(0);
  const ref                               = useRef(null);
  const token                             = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    // poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res  = await fetch("https://final-project-rdr8.onrender.com/api/notifications/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnread(data.filter(n => !n.is_read).length);
      }
    } catch {}
  };

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      // mark as read when opening
      await fetch("https://final-project-rdr8.onrender.com/api/notifications/read/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60)   return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          position:   "relative",
          background: "rgba(194,160,114,0.1)",
          border:     `1px solid rgba(194,160,114,0.3)`,
          borderRadius: "50%",
          width: "42px", height: "42px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(194,160,114,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(194,160,114,0.1)"}
      >
        <FiBell size={18} style={{ color: colors.gold }} />
        {/* Unread badge */}
        {unread > 0 && (
          <div style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: "#e74c3c", color: "#fff",
            borderRadius: "50%", width: "18px", height: "18px",
            fontSize: "10px", fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif",
          }}>
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position:  "absolute",
          top: "52px", right: 0,
          width: "360px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(17,34,80,0.2)",
          zIndex: 999,
          overflow: "hidden",
          animation: "fadeUp 0.2s ease both",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid rgba(194,160,114,0.2)`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "10px", color: colors.gold, letterSpacing: "2px" }}>
                NOTIFICATIONS
              </div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: colors.navyDark }}>
                {notifications.length} total
              </div>
            </div>
            {/* Gold top line */}
            <div style={{
              fontSize: "11px", color: colors.gold,
              cursor: "pointer", letterSpacing: "0.5px",
            }}>
              {unread === 0 ? "All read ✓" : `${unread} unread`}
            </div>
          </div>

          {/* Notifications list */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: "40px 20px", textAlign: "center",
                color: "#bbb", fontSize: "13px",
              }}>
                <div style={{ color: "#ddd", marginBottom: "8px" }}><FiBell size={32} /></div>
                No notifications yet
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id} style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  background: n.is_read ? "#fff" : "rgba(194,160,114,0.06)",
                  transition: "background 0.2s",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(194,160,114,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = n.is_read ? "#fff" : "rgba(194,160,114,0.06)"}
                >
                  {/* Icon based on message content */}
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                    background: n.message.includes("validated") || n.message.includes("Congratulations")
                      ? "rgba(39,174,96,0.1)"
                      : n.message.includes("rejected") || n.message.includes("refused")
                      ? "rgba(231,76,60,0.1)"
                      : "rgba(194,160,114,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px",
                  }}>
                    {n.message.includes("validated") || n.message.includes("Congratulations")
  ? <FiCheckCircle size={16} style={{ color: "#27ae60" }} />
  : n.message.includes("rejected") || n.message.includes("refused")
  ? <FiXCircle size={16} style={{ color: "#e74c3c" }} />
  : <FiMail size={16} style={{ color: colors.gold }} />}
                  </div>
<div style={{ flex: 1 }}>
  <div style={{ fontSize: "13px", color: colors.navyDark, lineHeight: 1.5, marginBottom: "4px" }}>
    {n.message.includes("/media/") ? n.message.split("Download your PDF:")[0] : n.message}
    {n.message.includes("/media/") && <a href={"https://final-project-rdr8.onrender.com" + n.message.split("Download your PDF:")[1]?.trim()} target="_blank" rel="noreferrer" style={{ color: colors.gold, fontWeight: "bold", display: "block", marginTop: "4px" }}>✦ Download Convention de Stage PDF</a>}
  </div>
                    <div style={{ fontSize: "11px", color: "#bbb" }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.is_read && (
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: colors.gold, flexShrink: 0, marginTop: "4px",
                    }} />
                  )}
                </div>
              ))
            )}        
          </div>
        </div>
      )}
    </div>
  );
}