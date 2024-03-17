"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PieChart, type LucideProps, List } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: (props: LucideProps) => React.ReactNode;
  label?: string;
  description?: string;
}
const items: NavItem[] = [
  {
    href: "/",
    icon: PieChart,
    title: "Dashboard",
    label: "Dashboard",
  },
  {
    href: "/categories",
    icon: List,
    title: "Categories",
    label: "Categories",
  },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <Card className={cn(`relative flex h-screen w-64 flex-col border-r`)}>
      <CardHeader>
        <Link href="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">LOGO</h1>
        </Link>
      </CardHeader>
      <CardContent>
        <nav className="grid items-start gap-2">
          {items.map((item, index) => {
            const Icon = item.icon ?? (() => <div />);
            return (
              item.href && (
                <Link key={index} href={item.disabled ? "/" : item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href ? "bg-secondary" : "transparent",
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

      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </CardFooter>
    </Card>
  );
}