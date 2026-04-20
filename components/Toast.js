import React from "react";

const Toast = ({ messages, onClose, enabled }) => {
  return (
    <div
      id="instructionToast"
      className={`toast ${messages.length > 0 && "show"}`}>
      <p className="toast-text" id="toastMessage">
        {messages[0]?.text}
      </p>
      <button
        id="closeToast"
        onClick={() => {
          if (!enabled) return;
          onClose(messages[0]._id, messages[0].local);
        }}
        className="toast-close-btn">
        <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>
          close
        </span>
      </button>
    </div>
  );
};

export default Toast;
