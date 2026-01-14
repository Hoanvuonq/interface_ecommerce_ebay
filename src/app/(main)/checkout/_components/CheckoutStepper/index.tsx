import React from "react";
import { ISteps } from "../../_types/stepper";

interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 py-4 px-6 shadow-sm">
      <div className="flex items-center justify-between w-full relative">
        {ISteps.map((step, index) => {
          // Logic trạng thái
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const isPending = currentStep < index;
          const isLastStep = index === ISteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Vòng tròn bước */}
              <div className="relative flex flex-col items-center z-10">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 border-2 
                    ${
                      isActive
                        ? "bg-orange-500 border-gray-500 text-white shadow-lg shadow-orange-200 scale-110"
                        : isCompleted
                        ? "bg-white border-gray-500 text-orange-500"
                        : "bg-white border-gray-200 text-gray-300"
                    }
                  `}
                >
                  <step.icon
                    size={isActive ? 20 : 18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-transform duration-500 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>

                {/* Tiêu đề bước */}
                <span
                  className={`mt-2 text-[11px] font-bold uppercase tracking-tighter transition-all duration-500 absolute top-10 w-32 text-center
                    ${
                      isActive
                        ? "text-orange-600 opacity-100 translate-y-0"
                        : isCompleted
                        ? "text-orange-500 opacity-80"
                        : "text-gray-400 opacity-50"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>

              {!isLastStep && (
                <div className="flex-auto h-0.75 bg-gray-100 rounded-full mx-2 relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 left-0 h-full w-full bg-orange-500 transition-all duration-500" />
                  )}

                  {isActive && (
                    <div className="absolute top-0 left-0 h-full w-full bg-gray-100">
                      <div
                        className="absolute top-0 left-0 h-full w-full bg-linear-to-r from-transparent via-orange-500 to-transparent animate-loading-flow"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default CheckoutStepper;
