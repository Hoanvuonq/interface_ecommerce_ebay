"use client";

import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { UserDetail } from "@/types/user/user.type";

interface ProfileHeaderCardProps {
  user: UserDetail;
  statusLabelMap: Record<string, string>;
  getRoleBadgeStyle: (role: string) => string;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  user,
  statusLabelMap,
  getRoleBadgeStyle,
}) => {
  const avatarUrl = user.image
    ? toPublicUrl(toSizedVariant(user.image, "_orig"))
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <div className="relative p-4 rounded-4xl bg-linear-to-br from-gray-900 via-gray-800 to-orange-950 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full -ml-20 -mb-20 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-orange-500 rounded-[3.2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

          <div className="w-36 h-36 relative z-10 overflow-hidden rounded-[3rem] border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            <Image
              src={avatarUrl}
              alt={`${user.username}'s avatar`}
              fill
              sizes="(max-width: 768px) 144px, 176px"
              className="object-cover"
              priority
              unoptimized={avatarUrl.includes("dicebear.com")}
            />
          </div>

          <div
            className={cn(
              "absolute -bottom-2 right-4 z-20 px-4 py-1.5 rounded-full border-2 border-gray-900 text-[10px] font-bold text-white shadow-xl uppercase tracking-tighter",
              user.status === "ACTIVE" ? "bg-emerald-500" : "bg-orange-500",
            )}
          >
            {statusLabelMap[user.status]}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {(user.roles || [user.roleName]).map((role: string, i: number) => (
              <span
                key={i}
                className={cn(
                  "px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg",
                  getRoleBadgeStyle(role),
                )}
              >
                {role}
              </span>
            ))}
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 uppercase italic flex items-center justify-center md:justify-start gap-3">
              {user.username}
              <ShieldCheck className="text-orange-500" size={28} />
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 text-gray-400 font-bold text-xs bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                <Mail size={14} className="text-orange-500" /> {user.email}
              </span>
              <span className="flex items-center gap-2 text-gray-400 font-bold text-xs bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                <Clock size={14} className="text-orange-500" /> Joined
                {dayjs(user.createdDate).format("MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
