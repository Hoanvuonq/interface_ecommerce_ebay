"use client";

import React from "react";
import { Logo } from "./_components/Logo";
import { WelcomeText } from "./_components/WelcomeText";
import { FeatureCard } from "./_components/FeatureCard";
import { getAuthPanelData ,AuthPanelType} from "../../_constants/future";

interface ILeftSideFormProps {
  type: AuthPanelType;
}

export const LeftSideForm: React.FC<ILeftSideFormProps> = ({ type }) => {
  const content = getAuthPanelData(type);
  const LogoIcon = content.logoIcon; 
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center items-start px-8 xl:px-16 2xl:px-24">
      <div className="max-w-xl">
        <Logo 
          icon={<LogoIcon />} 
          gradientClass={`bg-gradient-to-br ${content.logoGradientFrom} ${content.logoGradientTo}`}
          titleClassName={`!mb-0 !text-5xl !text-gray-800 dark:!text-gray-100 font-bold bg-gradient-to-r ${content.brandColorFrom} ${content.brandColorTo} bg-clip-text text-transparent`}
        />
        <WelcomeText type={type} />
        <div className="space-y-5">
          {content.features.map((featureData, index) => (
            <FeatureCard 
              key={index} 
              {...featureData} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};