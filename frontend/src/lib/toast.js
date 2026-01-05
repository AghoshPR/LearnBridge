import toast from "react-hot-toast";

/* 🔴 ERROR TOAST */
export const errorToast = (message) =>
  toast(message, {
    icon: "⛔",
    style: {
      background: "rgba(220, 38, 38, 0.18)",
      color: "#fecaca",
      border: "1px solid rgba(220, 38, 38, 0.5)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: "14px",
      padding: "14px 16px",
      boxShadow: "0 10px 30px rgba(220,38,38,0.35)",
    },
  });

/* 🟢 SUCCESS TOAST */
export const successToast = (message) =>
  toast(message, {
    icon: "✅",
    style: {
      background: "rgba(22, 163, 74, 0.18)",
      color: "#bbf7d0",
      border: "1px solid rgba(22, 163, 74, 0.5)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: "14px",
      padding: "14px 16px",
      boxShadow: "0 10px 30px rgba(22,163,74,0.35)",
    },
  });

/* 🔵 INFO TOAST */
export const infoToast = (message) =>
  toast(message, {
    icon: "ℹ️",
    style: {
      background: "rgba(59, 130, 246, 0.18)",
      color: "#bfdbfe",
      border: "1px solid rgba(59, 130, 246, 0.5)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: "14px",
      padding: "14px 16px",
      boxShadow: "0 10px 30px rgba(59,130,246,0.35)",
    },
  });
