import type { USER_SEND_MESSAGE_NAME } from "@amigo-llm/types";
import { taskOrchestrator } from "@/core/conversation";
import BaseMessageResolver from "./base";

export class ConfirmMessageResolver extends BaseMessageResolver<"confirm"> {
  static override resolverName: USER_SEND_MESSAGE_NAME = "confirm";

  override async process(_message: { taskId: string }): Promise<void> {
    // 不使用 setUserInput，因为 "confirm" 不应该被添加到 memory
    // 只设置 userInput 作为控制信号
    this.conversation.userInput = "confirm";
    this.conversation.isAborted = false;

    if (this.conversation.status === "waiting_tool_confirmation") {
      const executor = taskOrchestrator.getExecutor(this.conversation.id);
      executor.execute(this.conversation);
    }
  }
}
