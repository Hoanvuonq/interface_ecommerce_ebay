"use client";

import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";
import { MessageSquare, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export const ShopActions = ({ shopId, onChat, chatLoading }: any) => {
  const router = useRouter();

  return (
    <div className="flex gap-3 w-full">
      <Button variant="edit" loading={chatLoading} onClick={onChat}>
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Chat ngay
        </span>
      </Button>
      <ButtonField
        form="address-form"
        htmlType="submit"
        type="login"
        onClick={() => router.push(`/shop/${shopId}`)}
        className="flex w-36 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        <span className="flex items-center gap-2">
          <Store className="w-4 h-4" />
          Xem Shop
        </span>
      </ButtonField>
    </div>
  );
};
