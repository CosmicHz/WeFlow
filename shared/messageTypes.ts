/**
 * 消息类型常量、标签映射和判断函数
 *
 * 这是项目中消息类型判断的唯一真相来源（Single Source of Truth）。
 * 前端（src/）和后端（electron/）都应从此模块导入，
 * 而非在各自代码中硬编码 localType 数字。
 */

// ==================== 常量 ====================

/** 微信消息 localType 枚举 */
export const MSG_TYPE = {
  TEXT: 1,
  IMAGE: 3,
  VOICE: 34,
  CARD: 42,
  VIDEO: 43,
  EMOJI: 47,
  LOCATION: 48,
  APP_MESSAGE: 49,
  CALL: 50,
  SYSTEM: 10000,
  RECALL: 10002,
  PAT: 266287972401,
  QUOTE_TEXT: 244813135921,
  CHAT_RECORD: 81604378673,
  MINI_PROGRAM: 154618822705,
  RED_PACKET: 8594229559345,
  TRANSFER: 8589934592049,
  FILE_V1: 34359738417,
  FILE_V2: 103079215153,
  FILE_V3: 25769803825,
} as const

/** 文件类 localType 集合 */
export const FILE_APP_LOCAL_TYPES = [
  MSG_TYPE.APP_MESSAGE,
  MSG_TYPE.FILE_V1,
  MSG_TYPE.FILE_V2,
  MSG_TYPE.FILE_V3,
] as const
export const FILE_APP_LOCAL_TYPE_SET = new Set<number>(FILE_APP_LOCAL_TYPES)

/** 系统消息 localType 集合 */
export const SYSTEM_MESSAGE_TYPES = [
  MSG_TYPE.SYSTEM,
  MSG_TYPE.PAT,
] as const

/** AppMessage 内部 xmlType 枚举（与 localType 是不同的编号体系） */
export const XML_TYPE = {
  LINK: 5,
  LINK_V2: 49,
  FILE: 6,
  MUSIC: 3,
  CHAT_RECORD: 19,
  MINI_PROGRAM_V1: 33,
  MINI_PROGRAM_V2: 36,
  QUOTE: 57,
  SOLITAIRE: 53,
  TRANSFER: 2000,
  RED_PACKET: 2001,
  VIDEO_ACCOUNT: 51,
  GIFT: 115,
  GROUP_NOTE: 62,
  VOIP: 87,
} as const

/** 转发聊天记录中子消息的 datatype 枚举（与 localType 是不同的编号体系） */
export const DATATYPE = {
  TEXT: 1,
  IMAGE: 3,
  VOICE: 34,
  VIDEO: 43,
  EMOJI: 47,
  LOCATION: 48,
  APP_MESSAGE: 49,
  FILE: 8,
  CHAT_RECORD: 17,
} as const

/** 联系人 localType 枚举（与消息 localType 是不同的含义） */
export const CONTACT_TYPE = {
  /** 非好友联系人（可能是公众号、已删除的好友等，需结合其他字段区分） */
  NOT_FRIEND: 0,
  /** 好友 */
  FRIEND: 1,
} as const

// ==================== 标签映射 ====================

/** localType → 中文标签（无括号，用于统计图表等） */
export const MESSAGE_TYPE_LABELS: Record<number, string> = {
  [MSG_TYPE.TEXT]: '文本',
  [MSG_TYPE.QUOTE_TEXT]: '文本',
  [MSG_TYPE.IMAGE]: '图片',
  [MSG_TYPE.VOICE]: '语音',
  [MSG_TYPE.CARD]: '名片',
  [MSG_TYPE.VIDEO]: '视频',
  [MSG_TYPE.EMOJI]: '表情',
  [MSG_TYPE.LOCATION]: '位置',
  [MSG_TYPE.APP_MESSAGE]: '链接/文件',
  [MSG_TYPE.CALL]: '通话',
  [MSG_TYPE.SYSTEM]: '系统消息',
  [MSG_TYPE.RECALL]: '撤回消息',
  [MSG_TYPE.PAT]: '拍一拍',
  [MSG_TYPE.CHAT_RECORD]: '聊天记录',
  [MSG_TYPE.MINI_PROGRAM]: '小程序',
  [MSG_TYPE.RED_PACKET]: '红包',
  [MSG_TYPE.TRANSFER]: '转账',
  [MSG_TYPE.FILE_V1]: '文件',
  [MSG_TYPE.FILE_V2]: '文件',
  [MSG_TYPE.FILE_V3]: '文件',
}

/** localType → 带括号标签（用于消息内联显示） */
export const MESSAGE_TYPE_BRACKET_LABELS: Record<number, string> = {
  [MSG_TYPE.TEXT]: '[文本]',
  [MSG_TYPE.IMAGE]: '[图片]',
  [MSG_TYPE.VOICE]: '[语音]',
  [MSG_TYPE.CARD]: '[名片]',
  [MSG_TYPE.VIDEO]: '[视频]',
  [MSG_TYPE.EMOJI]: '[动画表情]',
  [MSG_TYPE.LOCATION]: '[位置]',
  [MSG_TYPE.APP_MESSAGE]: '[链接]',
  [MSG_TYPE.CALL]: '[通话]',
  [MSG_TYPE.SYSTEM]: '[系统消息]',
  [MSG_TYPE.RECALL]: '[撤回消息]',
  [MSG_TYPE.PAT]: '拍一拍',
  [MSG_TYPE.QUOTE_TEXT]: '[引用消息]',
  [MSG_TYPE.CHAT_RECORD]: '[聊天记录]',
  [MSG_TYPE.MINI_PROGRAM]: '[小程序]',
  [MSG_TYPE.RED_PACKET]: '[红包]',
  [MSG_TYPE.TRANSFER]: '[转账]',
  [MSG_TYPE.FILE_V1]: '[文件]',
  [MSG_TYPE.FILE_V2]: '[文件]',
  [MSG_TYPE.FILE_V3]: '[文件]',
}

/** 引用消息的 referType → 标签（用于 renderReferContent，key 为字符串） */
export const REFER_TYPE_LABELS: Record<string, string> = {
  [MSG_TYPE.IMAGE]: '图片',
  [MSG_TYPE.VOICE]: '语音',
  [MSG_TYPE.VIDEO]: '视频',
  [MSG_TYPE.CALL]: '通话',
  [MSG_TYPE.SYSTEM]: '系统消息',
  [MSG_TYPE.RECALL]: '撤回消息',
}

// ==================== 判断函数 ====================

/** 判断是否为系统消息 */
export function isSystemMessage(localType: number): boolean {
  return (SYSTEM_MESSAGE_TYPES as readonly number[]).includes(localType)
}

/** 判断是否为文件类 localType */
export function isFileAppLocalType(localType: number): boolean {
  return FILE_APP_LOCAL_TYPE_SET.has(localType)
}

/** 判断是否为媒体消息（图片/视频/表情/文件） */
export function isMediaMessage(localType: number): boolean {
  return (
    localType === MSG_TYPE.IMAGE ||
    localType === MSG_TYPE.VIDEO ||
    localType === MSG_TYPE.EMOJI ||
    isFileAppLocalType(localType)
  )
}

/** 获取资源类型（用于导出/附件分类） */
export function resolveResourceType(
  localType: number,
  appMsgKind?: string,
  xmlType?: string
): 'image' | 'video' | 'voice' | 'file' | null {
  if (localType === MSG_TYPE.IMAGE) return 'image'
  if (localType === MSG_TYPE.VIDEO) return 'video'
  if (localType === MSG_TYPE.VOICE) return 'voice'
  if (isFileAppLocalType(localType)) {
    if (appMsgKind === 'file' || xmlType === String(XML_TYPE.FILE)) return 'file'
    if (localType !== MSG_TYPE.APP_MESSAGE) return 'file'
  }
  return null
}

/** 获取 WeClone 导出格式的类型名 */
export function getWeCloneTypeName(localType: number): string {
  switch (localType) {
    case MSG_TYPE.TEXT:
      return 'text'
    case MSG_TYPE.IMAGE:
      return 'image'
    case MSG_TYPE.EMOJI:
      return 'sticker'
    case MSG_TYPE.VIDEO:
      return 'video'
    case MSG_TYPE.VOICE:
      return 'voice'
    case MSG_TYPE.LOCATION:
      return 'location'
    default:
      if (isFileAppLocalType(localType)) return 'file'
      return 'text'
  }
}

/** 获取消息类型标签（带括号） */
export function getMessageTypeLabel(localType: number): string {
  return MESSAGE_TYPE_BRACKET_LABELS[localType] || '[消息]'
}

/** 获取消息类型标签（无括号） */
export function getMessageTypeLabelPlain(localType: number): string {
  return MESSAGE_TYPE_LABELS[localType] || '其他'
}
