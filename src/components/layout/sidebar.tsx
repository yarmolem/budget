"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { PieChart, type LucideProps, List, Euro, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useMemo } from "react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  description?: string;
  icon?: (props: LucideProps) => React.ReactNode;
}

export default function Sidebar() {
  const path = usePathname();
  const { t, lng } = useTranslation("sidebar");

  const items: NavItem[] = useMemo(
    () => [
      {
        href: "/",
        icon: PieChart,
        title: t("dashboard"),
      },
      {
        icon: List,
        href: "/categories",
        title: t("categories"),
      },
      {
        icon: Euro,
        href: "/transactions",
        title: t("transactions"),
      },
      {
        icon: Tag,
        href: "/tags",
        title: t("tags"),
      },
    ],
    [],
  );

  return (
    <aside className="h-screen w-64 py-3 pl-3">
      <Card className={cn(`relative flex h-full flex-col`)}>
        <CardHeader>
          <Link href="/" className="flex items-center justify-center space-x-3">
            <h1 className="text-center text-2xl font-bold">LOGO</h1>
          </Link>
        </CardHeader>
        <CardContent className="p-3">
          <nav className="grid items-start gap-2">
            {items.map((item, index) => {
              const Icon = item.icon ?? (() => <div />);
              return (
                item.href && (
                  <Link key={index} href={item.disabled ? "/" : item.href}>
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
                      <span>{item.title}</span>
                    </span>
                  </Link>
                )
              );
            })}
          </nav>
        </CardContent>

        <CardFooter className="mt-auto p-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => void signOut()}
          >
            {t("logout")}
          </Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
