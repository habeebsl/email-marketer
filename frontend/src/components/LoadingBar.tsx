interface LoadingBarProps {
  progress?: number;
  isIndeterminate?: boolean;
  height?: string;
  color?: string;
}

export function LoadingBar({
  progress = 0,
  isIndeterminate = true,
  height = "4px",
  color = "#2563eb",
}: LoadingBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${isIndeterminate ? "animate-loadingBar" : ""}`}
        style={{
          width: isIndeterminate ? "100%" : `${progress}%`,
          height,
          backgroundColor: color,
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
}
