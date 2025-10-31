import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="w-full h-dvh flex items-center justify-center">
        <div className="relative">
          <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
          <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-primary/10" />
        </div>
      </div>
    </div>
  );
}
