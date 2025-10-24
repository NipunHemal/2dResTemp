import { Loader2 } from "lucide-react";

// Define the size types
type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

// Define the component's props interface
interface LoadingSpinnerProps {
  size?: SpinnerSize;
}

// A record to map size strings to Tailwind classes
const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

/**
 * A reusable loading spinner component using lucide-react and Tailwind CSS.
 */
export const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center justify-items-center items-center p-5">
      <Loader2
        className={`animate-spin ${sizeClasses[size]}`}
        aria-label="Loading..."
      />
    </div>
  );
};
