"use client";
import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { DataContext } from "./ToastContext";
import ToastComponent from "./Toast";
import { useUser } from "@/lib/useUser";

const SessionWrapper = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const { data, isLoading } = useUser();
  const user = data?.user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setMessages(user?.messages);
    }
  }, [user]);

  const onClose = async (id, local) => {
    if (loading) return;
    setLoading(true);

    try {
      if (!local) {
        await fetch("/api/deleteMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageId: id }),
        });
      }

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } finally {
      setLoading(false);
    }
  };

  const Toast = {
    show: (message) => {
      setMessages((prev) => [...prev, { text: message, local: false }]);
    },
  };
  return (
    <SessionProvider>
      <DataContext.Provider
        value={{
          Toast,
        }}>
        <ToastComponent
          setMessages={setMessages}
          messages={messages}
          onClose={onClose}
          enabled={!loading}
        />
        {children}
      </DataContext.Provider>
    </SessionProvider>
  );
};

export default SessionWrapper;
