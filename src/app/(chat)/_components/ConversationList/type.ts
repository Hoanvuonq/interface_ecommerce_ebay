
export interface ConversationListProps {
  conversations: any[];
  selectedConversationId?: string;
  onSelect: (conversation: any) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
  height: number;
  isMobileView?: boolean;
 getShopAvatar: (c: any) => string | undefined;
  getShopName: (c: any) => string | undefined;  
}