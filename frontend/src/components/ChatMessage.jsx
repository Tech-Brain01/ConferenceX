import { Badge } from "./ui/badge.jsx";

export default function ChatMessage({ message, isUser, username }) {
  return (
    <div
      className={`flex mb-2 relative p-5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Badge on the left if admin (not user), else on right */}
      <Badge
        variant="metallicCream"
        className={`absolute top-[-12px] ${
          isUser ? "right-0 rounded-full" : "left-0 rounded-full"
        } px-3 py-0.5 text-xs font-semibold shadow-md`}
      >
        {username}
      </Badge>

      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isUser
            ? "bg-yellow-200 text-yellow-900 rounded-br-none"
            : "bg-yellow-100 text-yellow-900 rounded-bl-none"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
