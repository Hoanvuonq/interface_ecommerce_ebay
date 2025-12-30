import { Employee } from "../../_types/employee.type";

export interface EmployeeFormProps {
  open: boolean;
  employee?: Employee | null;
  onClose: () => void;
  onSuccess?: () => void;
  mode: "create" | "update";
}
