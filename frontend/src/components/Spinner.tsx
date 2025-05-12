interface SpinnerProps {
  statusMessage?: string;
}

export function Spinner({ statusMessage }: SpinnerProps) {
  return (
    <div className="fixed z-9999 inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-8"></div>
      {statusMessage && (
        <div className="text-white text-lg animate-fade-in-out">
          {statusMessage}
        </div>
      )}
    </div>
  );
}