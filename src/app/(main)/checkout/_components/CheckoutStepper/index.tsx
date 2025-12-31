import React from "react";
import { ISteps } from "../../_types/stepper";
interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
 
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-3 px-6">
      <div className="flex items-center justify-between w-full">
        {ISteps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const isPending = currentStep < index;
          const isLastStep = index === ISteps.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div className="relative flex flex-col items-center z-10">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border-2 
                    ${
                      isActive
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                        : isCompleted
                        ? "bg-white border-orange-500 text-orange-500"
                        : "bg-white border-gray-200 text-gray-300"
                    }
                  `}
                >
                  <step.icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors duration-300 hidden sm:block absolute top-10 w-32 text-center
                    ${
                      isActive
                        ? "text-orange-600 font-bold"
                        : isCompleted
                        ? "text-orange-500"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>

              {!isLastStep && (
                <div className="flex-auto mx-2 sm:mx-4 h-0.5 bg-gray-100 rounded relative">
                  <div
                    className={`absolute top-0 left-0 h-full bg-orange-500 transition-all duration-500 ease-out rounded
                      ${isCompleted ? "w-full" : "w-0"}
                    `}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="h-6 sm:h-8"/>
    </div>
  );
};

export default CheckoutStepper;