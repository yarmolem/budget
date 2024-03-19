import Sidebar from "@/components/layout/sidebar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

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
      <main className="h-full w-full p-3">{children}</main>
    </div>
  );
}
