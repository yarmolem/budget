"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { items } from "@/data/nav-items";
import { useTranslation } from "@/hooks/use-translation";

type Props = {
  className?: string;
  onClose?: () => void;
};

const SidebarContent = (props: Props) => {
  const path = usePathname();
  const { t, lng } = useTranslation("sidebar");

  return (
    <nav className={cn("grid items-start gap-2", props.className)}>
      {items.map((item, index) => {
        const Icon = item.icon ?? (() => <div />);
        return (
          item.href && (
            <Link
              key={index}
              onClick={props.onClose}
              href={item.disabled ? "/" : item.href}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === `/${lng}${item.href === "/" ? "" : item.href}`
                    ? "bg-secondary"
                    : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{t(item.title)}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
};

export { SidebarContent };
