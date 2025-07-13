// 定义单条消息接口
import type { TalkRole } from "@/types/business/talk.type";

export interface ITalkMessage {
  id: string; // 消息唯一ID
  content: string; // 消息内容
  role: TalkRole; // 发言者角色
}
