"use client";

import {
  WelcomeTextType,
  getWelcomeTextContent,
} from "../../../../_constants/formLogin";

interface IWelcomeTextProps {
  type?: WelcomeTextType;
  className?: string;
}

export const WelcomeText = ({
  type = "default",
  className = "",
}: IWelcomeTextProps) => {
  const { title: titleText, description: descriptionText } =
    getWelcomeTextContent(type);

  return (
    <div className={`space-y-4 mb-12 ${className}`}>
      <h2 className="text-4xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
        {titleText}
      </h2>

      <p className="text-lg block leading-relaxed text-gray-800 dark:text-gray-100">
        {descriptionText}
      </p>
    </div>
  );
};
