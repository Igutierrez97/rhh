import { ModalProvider, Navbar, Sidebar } from "@/components";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <section className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <ModalProvider>
        <div className="flex flex-grow">
          <Sidebar session={session} />
          <main className="flex-grow p-4 ">{children}</main>
        </div>
      </ModalProvider>
    </section>
  );
}
