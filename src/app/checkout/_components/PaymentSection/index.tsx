import { CreditCard } from "lucide-react";
import { PAYMENT_METHODS } from "../../_types/checkout";
import { RadioOption } from "@/components";

export const PaymentSection = ({ selectedMethod, onChange }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <CreditCard className="text-orange-500 w-5 h-5" /> Phương thức thanh toán
    </h3>
    <div className="space-y-3">
      {PAYMENT_METHODS.map((method) => (
        <RadioOption
          key={method.id}
          label={method.label}
          subLabel={method.subLabel}
          value={method.id}
          checked={selectedMethod === method.id}
          onChange={() => onChange(method.id)}
        />
      ))}
    </div>
  </div>
);