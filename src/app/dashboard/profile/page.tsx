"use client";

import { useSession } from "next-auth/react";
import { EditIcon, Loading, useModal } from "@/components";

export default function Profile() {
  const { data: session, status } = useSession();
  const { openEditModal } = useModal();

  console.log(session);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh", // Ocupa todo el alto de la pantalla
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-2 border-gray-200 p-5 rounded-md shadow-lg bg-white w-80">
        <div className="flex justify-end mb-3">
          <button className="btn bg-gray-200">
            <EditIcon width={15} height={15} />
          </button>
        </div>
        <img
          src="/profile.jpg"
          alt="Profile Picture"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{session?.user?.name}</h1>
        <p>Email: {session?.user?.email}</p>
        <p>Rol: {session?.user?.role}</p>
      </div>
    </div>
  );
}
