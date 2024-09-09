import { cn } from "@/lib/utils";
import Image from "next/image";
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
      <Image src="/assets/imagotipo.svg" alt="logo" width={180} height={180} />
    </Link>
  );
};

export { Logo };
