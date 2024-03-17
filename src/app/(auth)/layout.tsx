import ToggleTheme from "@/components/shared/toggle-theme";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <ToggleTheme className="absolute right-4 top-4" />

      {children}
    </div>
  );
}
