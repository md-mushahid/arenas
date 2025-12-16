import { useState, useEffect, useRef } from "react";
import { Input, Button, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Rule {
  id: string;
  title: string;
  description: string;
}

interface SupportChatProps {
  rules?: Rule[];
}

const SupportChatSideBySide: React.FC<SupportChatProps> = ({ rules = [] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        content: data.reply || "Sorry, I didn't understand.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        content: "Oops! Something went wrong.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 500,
        gap: 16,
      }}
    >
      {/* Left Chat Section */}
      <div
        style={{
          flex: 1, // take half width
          backgroundColor: "#1f1f1f",
          color: "#fff",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>AI Support</h3>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: 8,
            paddingRight: 8,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 16,
                  backgroundColor: msg.sender === "user" ? "#4260fa" : "#333",
                  color: "#fff",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={loading}
            style={{ borderRadius: 20 }}
          />
          <Button
            onClick={sendMessage}
            icon={<SendOutlined />}
            type="primary"
            disabled={loading}
          >
            {loading ? <Spin size="small" /> : "Send"}
          </Button>
        </div>
      </div>

      {/* Right Rules Section */}
      <div
        style={{
          flex: 1, // take half width
          backgroundColor: "#f9f9f9",
          padding: 16,
          borderRadius: 8,
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Arena Booking Rules</h3>
        {rules.length === 0 ? (
          <p>No rules defined.</p>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              style={{
                marginBottom: 12,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            >
              <strong>{rule.title}</strong>
              <p style={{ margin: 0 }}>{rule.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportChatSideBySide;
