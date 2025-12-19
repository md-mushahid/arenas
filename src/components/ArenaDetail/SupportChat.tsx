
import { useState, useEffect, useRef } from "react";
import { Input, Button, Spin, Card } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";

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
      const history = messages.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));
      const res = await fetch("/api/support/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: history,
        }),
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
    <div className="flex flex-col md:flex-row gap-6 h-[600px] w-full">
      {/* Left Chat Section */}
      <Card className="flex-1 glass-panel border-0 flex flex-col h-full" bodyStyle={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
         <div className="p-4 border-b border-gray-800 bg-gray-900/50 rounded-t-xl flex items-center gap-2">
            <RobotOutlined className="text-blue-500 text-lg" />
            <h3 className="text-white font-semibold text-lg m-0">AI Support Assistant</h3>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0e13]/50">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                    <RobotOutlined className="text-4xl mb-2" />
                    <p>Ask me anything about the arena!</p>
                </div>
            )}
            {messages.map((msg) => (
                <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div className={`
                        max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${msg.sender === "user" 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-[#1f2937] text-gray-200 border border-gray-700 rounded-bl-none"}
                    `}>
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         <div className="p-4 bg-gray-900/50 border-t border-gray-800 rounded-b-xl">
             <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your question..."
                    disabled={loading}
                    className="flex-1 bg-[#111620] border-gray-700 text-white placeholder-gray-500 rounded-full hover:border-blue-500 focus:border-blue-500"
                    size="large"
                />
                <Button
                    onClick={sendMessage}
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={loading ? <Spin size="small" /> : <SendOutlined />}
                    disabled={loading}
                    className="flex-shrink-0 shadow-lg shadow-blue-500/20 border-none bg-blue-600 hover:bg-blue-500"
                />
             </div>
         </div>
      </Card>
      <Card className="flex-1 glass-panel border-0 h-full flex flex-col" bodyStyle={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
         <div className="p-4 border-b border-gray-800 bg-gray-900/50 rounded-t-xl flex items-center gap-2">
            <QuestionCircleOutlined className="text-yellow-500 text-lg" />
            <h3 className="text-white font-semibold text-lg m-0">Arena Rules & Guidelines</h3>
         </div>

         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0a0e13]/50 rounded-b-xl">
            {rules.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                    <p>No special rules defined for this arena.</p>
                 </div>
            ) : (
                <div className="space-y-3">
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-[#1f2937]/50 border border-gray-800 p-4 rounded-xl hover:bg-[#1f2937] transition-colors duration-200">
                             <h4 className="text-blue-400 font-medium mb-1 text-base">{rule.title}</h4>
                             <p className="text-gray-400 text-sm leading-relaxed m-0">{rule.description}</p>
                        </div>
                    ))}
                </div>
            )}
         </div>
      </Card>
    </div>
  );
};

export default SupportChatSideBySide;
