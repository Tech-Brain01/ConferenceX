import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Input } from "./ui/input.jsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function ChatWindow({ messages, onSend, status }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const isResolved = status === "resolved";

  return (
    <div className="flex flex-col h-full rounded-lg shadow-md bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200">
      <div className="flex-grow overflow-y-auto p-5 bg-gradient-to-tr from-yellow-100 to-yellow-50 rounded-t-lg">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg.text}
            isUser={msg.isUser}
            username={msg.isUser ? "Aryan" : "Admin"}
          />
        ))}

        <div ref={scrollRef} />
      </div>

      {/* Only show input area if status is NOT resolved */}
      {!isResolved && (
        <div className="border-t border-yellow-300 p-4 bg-yellow-50 rounded-b-lg">
          <div className="relative w-full">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="w-full pr-24 rounded-md border border-yellow-300 bg-yellow-100 text-yellow-900 placeholder-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <PaperAirplaneIcon
              onClick={handleSend}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-yellow-500 hover:text-yellow-600 transition-colors"
              style={{
                filter: "drop-shadow(0 0 1px #fff) brightness(1.1) saturate(1.2)",
              }}
              aria-label="Send message"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              width={24}
              height={24}
            />
          </div>
        </div>
      )}

      {/* Optionally show a message if chat is closed */}
      {isResolved && (
        <div className="border-t border-yellow-300 p-4 bg-yellow-50 rounded-b-lg text-center text-gray-500 italic">
          This conversation is closed.
        </div>
      )}
    </div>
  );
}
