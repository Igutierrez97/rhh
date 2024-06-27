import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AdminFileTable, FileTable, ModalProvider } from "@/components";


export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session?.user?.role === "USER" ? (
        <ModalProvider>
          <FileTable />
        </ModalProvider>
      ) : (
        <AdminFileTable/>
      )}
    </div>
  );
}
