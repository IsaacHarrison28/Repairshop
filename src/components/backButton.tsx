"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type props = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({
  title,
  className,
  variant = "ghost",
  ...props
}: props) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => router.back()}
      {...props}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {title}
    </Button>
  );
}
