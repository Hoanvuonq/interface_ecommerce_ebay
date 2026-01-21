export interface ParticipateCampaignScreenProps {
  handleSelectCampaign: (campaign: any) => void;
  setSelectedSlot: (slot: any) => void;
  setShowRegisterModal: (v: boolean) => void;
  formatPrice: (price: number) => string;
}
