import { Session } from "next-auth";
import Link from "next/link";

export default async function Sidebar({session}:{session:Session|null}) {
  
  
  return (
    <div className="w-72 min-h-screen bg-gray-800 shadow-lg">
      <div className="flex flex-col items-center py-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      <nav className="mt-10">
        <Link href="/dashboard">
          <div className="w-full px-6 py-3 flex items-center text-white text-lg font-medium hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
            <svg
              className="h-6 w-6 text-white mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h6m-6 0a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1m-6 0V4m6 3v3"
              ></path>
            </svg>
            Documentos
          </div>
        </Link>
        {session?.user?.role === 'ADMIN' && (
          <Link href="/dashboard/users">
            <div className="w-full px-6 py-3 flex items-center text-white text-lg font-medium hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              <svg
                className="h-6 w-6 text-white mr-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12H8m0 0H7m1 0V8m0 4v4m8-4h1m-1 0v-4m0 4v4"
                ></path>
              </svg>
              Usuarios
            </div>
          </Link>
        )}
        <Link href="/dashboard/profile">
          <div className="w-full px-6 py-3 flex items-center text-white text-lg font-medium hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
            <svg
              className="h-6 w-6 text-white mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 13.121A4 4 0 1112.878 5.12a4 4 0 010 7.997m-6.254 2.345A8.003 8.003 0 0112 20h4a8.003 8.003 0 00-1.879-6.535M9 18v.01"
              ></path>
            </svg>
            Profile
          </div>
        </Link>
      </nav>
    </div>
  );
}