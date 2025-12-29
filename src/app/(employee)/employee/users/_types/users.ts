import { User } from "@/auth/_types/auth";

export interface IUserUpdateFormProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}
