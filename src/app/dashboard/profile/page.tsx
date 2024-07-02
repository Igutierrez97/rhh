"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { EditIcon, Loading } from "@/components";

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: session?.user?.email ?? "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/finduserbyemail/${session.user.email}`
          );
          if (!response.ok) {
            throw new Error("User not found");
          }
          const userData = await response.json();
          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            password: "",
            confirmPassword: "",
          });
        } catch (error) {
          setError("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [session]);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Loading />
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/edituserbyemail/${session?.user?.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: session?.user?.email, // No permitas cambiar el email desde el frontend si no es necesario
            role: formData.role,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating user");
      }
      const data = await response.json();
      console.log(data);
      setIsEditing(false);
    } catch (error) {
      setError("Error updating user");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {isEditing ? (
        <div className="border-2 border-gray-200 p-5 rounded-md shadow-lg bg-white w-80">
          <div className="flex justify-end mb-3">
            <button className="btn bg-gray-200" onClick={handleCancelClick}>
              Cancelar
            </button>
          </div>
          <form onSubmit={handleSaveClick}>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              className="btn bg-blue-500 text-white w-full py-2 rounded"
            >
              Guardar
            </button>
          </form>
        </div>
      ) : (
        <div className="border-2 border-gray-200 p-5 rounded-md shadow-lg bg-white w-80">
          <div className="flex justify-end mb-3">
            <button className="btn bg-gray-200" onClick={handleEditClick}>
              <EditIcon width={15} height={15} />
            </button>
          </div>
          <img
            src="/profile.jpg"
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{formData.name}</h1>
          <p>Email: {formData.email}</p>
          <p>Rol: {formData.role}</p>
        </div>
      )}
    </div>
  );
}
