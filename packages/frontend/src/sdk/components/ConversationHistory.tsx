import type { FC } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useTasks } from "../hooks/useTasks";

/**
 * Props for the ConversationHistory component
 */
export interface ConversationHistoryProps {
  /** Additional CSS class name */
  className?: string;
  /** Callback when a conversation is selected */
  onSelectConversation?: (taskId: string) => void;
  /** Current active task ID (for highlighting) */
  activeTaskId?: string;
}

/**
 * ConversationHistory component that displays a list of past conversations
 *
 * Uses the SDK's useTasks hook to display conversation history and allows
 * users to switch between different conversations.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ConversationHistory />
 *
 * // With custom callback
 * <ConversationHistory
 *   onSelectConversation={(taskId) => console.log('Selected:', taskId)}
 * />
 *
 * // With active task highlighting
 * <ConversationHistory activeTaskId="task-123" />
 *
 * // With custom styling
 * <ConversationHistory className="my-custom-class" />
 * ```
 */
export const ConversationHistory: FC<ConversationHistoryProps> = ({
  className = "",
  onSelectConversation,
  activeTaskId,
}) => {
  const { mainTaskId } = useTasks();
  const context = useWebSocketContext();
  const { store } = context;

  // Get task histories from store
  const taskHistories = store((state) => state.taskHistories);

  // Use activeTaskId if provided, otherwise fall back to mainTaskId
  const currentTaskId = activeTaskId ?? mainTaskId;

  /**
   * Format time display for conversation timestamps
   */
  const formatTime = (dateStr: string | undefined) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  /**
   * Handle conversation selection
   */
  const handleHistoryClick = (taskId: string) => {
    // Update main task ID in store
    store.getState().setMainTaskId(taskId);

    // Call custom callback if provided
    onSelectConversation?.(taskId);
  };

  // Don't render if no conversations
  if (!taskHistories || taskHistories.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <div className="text-center">
          <p className="text-sm mb-2">No conversations yet</p>
          <p className="text-xs">Start a new conversation to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`conversation-history ${className}`}>
      <ul className="space-y-1">
        {taskHistories.map((history) => {
          const isActive = history.taskId === currentTaskId;

          return (
            <li key={history.taskId} className="mb-3">
              <button
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  rounded-xl
                  text-sm
                  transition-all duration-150
                  border
                  ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                      : "bg-white border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                onClick={() => handleHistoryClick(history.taskId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleHistoryClick(history.taskId);
                  }
                }}
                aria-label={`Select conversation: ${history.title}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate flex-1" title={history.title}>
                    {history.title}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatTime(history.updatedAt)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationHistory;
