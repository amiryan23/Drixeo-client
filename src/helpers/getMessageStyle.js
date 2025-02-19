export  const getMessageStyle = (chat,s) => {
  if (chat?.joinedId) return s.admMsgItemJoined;
  if (chat?.leftId) return s.admMsgItemLeft;
  if (chat?.blockedId) return s.admMsgItemBlocked;
  if (chat?.unblockedId) return s.admMsgItemUnblocked;
  if(chat?.assignedOwnerId) return s.newOwner
  if(chat?.senderId) return s.giftedPremium
  if(chat?.giftSenderId) return s.giftBlock
  return s.admMsgItemDefault;
};


export const getStyleLevel = (level,s) => {
  if(level === 1) return s.level1
  if(level === 2) return s.level2
  if(level === 3) return s.level3
  if(level === 4) return s.level4
  if(level === 5) return s.level5
    return null
}