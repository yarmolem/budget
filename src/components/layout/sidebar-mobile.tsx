"use client";

import { MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Logo } from "../shared/logo";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { SidebarContent } from "../shared/sidebar-content";
import {
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import LanguageSwitcher from "../shared/language-switcher";

interface SidebarProps {
  className?: string;
}

export function SidebarMobile(_props: SidebarProps) {
  const { t } = useTranslation("sidebar");
  const [show, setShow] = useState(false);

  return (
    <Sheet open={show} onOpenChange={setShow}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="flex md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <Logo />
        </SheetHeader>
        <SidebarContent onClose={() => setShow(false)} />
        <SheetFooter className="mt-auto gap-y-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => void signOut()}
          >
            {t("logout")}
          </Button>

          <LanguageSwitcher />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
