import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
}

interface StepTrackerProps {
  steps: Step[];
}

const StepTracker = ({ steps }: StepTrackerProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                step.status === "completed"
                  ? "bg-green-500 border-green-500 text-white"
                  : step.status === "current"
                  ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                step.status === "completed" || step.status === "current"
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                step.status === "completed"
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
              style={{ minWidth: "60px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepTracker;