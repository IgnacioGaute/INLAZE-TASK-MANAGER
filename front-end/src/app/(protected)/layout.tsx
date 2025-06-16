import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col w-full overflow-hidden">
        {children}
      </div>
    </SessionProvider>
  );
}
