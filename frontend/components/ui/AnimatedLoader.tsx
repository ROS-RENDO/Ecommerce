
interface AnimatedLoaderProps {
  type?: "spinner" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  text?: string;
}

const AnimatedLoader = ({ type = "spinner", size = "md", text }: AnimatedLoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const SpinnerLoader = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );

  const PulseLoader = () => (
    <div className={`bg-blue-600 rounded-full animate-pulse ${sizeClasses[size]}`} />
  );

  const renderLoader = () => {
    switch (type) {
      case "dots": return <DotsLoader />;
      case "pulse": return <PulseLoader />;
      default: return <SpinnerLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {renderLoader()}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default AnimatedLoader;