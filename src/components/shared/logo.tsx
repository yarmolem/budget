import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  className?: string;
};

const Logo = (props: Props) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center space-x-3",
        props.className,
      )}
    >
      <h1 className="text-center text-2xl font-bold">LOGO</h1>
    </Link>
  );
};

export { Logo };
