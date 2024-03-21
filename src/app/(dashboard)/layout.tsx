import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import { getServerAuthSession } from "@/server/auth";
import ToggleTheme from "@/components/shared/toggle-theme";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex h-screen w-full flex-col overflow-y-auto px-4 py-3">
        <nav className="mb-4 px-6 py-2">
          <div className="flex">
            <ToggleTheme className="ml-auto" />
          </div>
        </nav>
        <div className="max-h-[100dvh_-_100px] w-full flex-1">{children}</div>
      </main>
    </div>
  );
}
