import { Plus } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "@/sdk";
import { useSidebar } from "./Layout/index";

const NewChatButton: React.FC = () => {
  const { store } = useWebSocketContext();
  const createNewConversation = store((state) => state.createNewConversation);
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();

  const handleClick = () => {
    createNewConversation();
    // Navigate to home page for new conversation
    navigate("/");
    close();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-gray-900"
      type="button"
    >
      <Plus className="w-5 h-5 shrink-0 text-gray-600" />
      <span
        className={`text-sm font-medium tracking-tight transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ display: isOpen ? "inline" : "none" }}
      >
        新建对话
      </span>
    </button>
  );
};

export default NewChatButton;
