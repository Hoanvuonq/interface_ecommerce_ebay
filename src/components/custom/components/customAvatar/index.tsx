import { cn } from "@/utils/cn";
import Image from "next/image";
import React from "react";

export const CustomAvatar: React.FC<any> = ({ size, src, icon: Icon, className, children, ...rest }) => {
    const sizeMap = { 48: 'w-12 h-12 text-xl', 72: 'w-[72px] h-[72px] text-2xl', default: 'w-10 h-10 text-lg' };
    const currentSize = sizeMap[size as keyof typeof sizeMap] || sizeMap.default;

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center overflow-hidden bg-gray-200 shrink-0",
                currentSize,
                className
            )}
            {...rest}
        >
            {src ? (
                <Image src={src} alt="Avatar" width={72} height={72} className="object-cover w-full h-full" />
            ) : Icon ? (
                React.cloneElement(Icon, { className: 'w-2/3 h-2/3' })
            ) : (
                <span className="font-semibold text-white">{children}</span>
            )}
        </div>
    );
};
