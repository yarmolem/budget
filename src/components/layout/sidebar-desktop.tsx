"use client";

import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";
import { SidebarContent } from "../shared/sidebar-content";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export interface SidebarProps {
  className?: string;
}

export function SidebarDesktop(props: SidebarProps) {
  const { t } = useTranslation("sidebar");

  return (
    <aside
      className={cn("hidden h-screen w-64 py-3 pl-3 md:block", props.className)}
    >
      <Card className="relative flex h-full flex-col">
        <CardHeader>
          <Logo />
        </CardHeader>
        <CardContent className="p-3">
          <SidebarContent />
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
