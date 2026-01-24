import type React from "react";
import ConversationHistory from "./ConversationHistory";
import NewChatButton from "./NewChatButton";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full h-full border-r border-gray-200 bg-white flex flex-col shrink-0">
      {/* 顶部操作栏 */}
      <div className="p-4 border-b border-gray-100">
        <NewChatButton />
      </div>

      {/* 历史记录列表 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        <ConversationHistory />
      </div>
    </aside>
  );
};

export default Sidebar;
