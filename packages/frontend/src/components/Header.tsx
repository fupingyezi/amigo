import { ChevronLeft, Menu } from "lucide-react";
import { useConnection } from "@/sdk";
import type { ConnectionStatus } from "@/sdk/types/store";
import { useSidebar } from "./Layout";

const statusConfig: Record<ConnectionStatus, { label: string; color: string; pulse?: boolean }> = {
  connected: { label: "已连接", color: "bg-green-500" },
  connecting: { label: "连接中...", color: "bg-yellow-500", pulse: true },
  reconnecting: { label: "重连中...", color: "bg-yellow-500", pulse: true },
  disconnected: { label: "已断开", color: "bg-red-500" },
};

const Header: React.FC = () => {
  const { status: connectionStatus } = useConnection();
  const { isOpen, toggle } = useSidebar();
  const config = statusConfig[connectionStatus];

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          aria-label={isOpen ? "收起侧边栏" : "展开侧边栏"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="text-xl font-bold text-gray-900 tracking-tight">Amigo</div>
      </div>
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 bg-white shadow-sm">
        <span
          className={`
            w-2 h-2 rounded-full ${config.color}
            ${config.pulse ? "animate-pulse" : ""}
          `}
        />
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {config.label}
        </span>
      </div>
    </header>
  );
};

export default Header;
