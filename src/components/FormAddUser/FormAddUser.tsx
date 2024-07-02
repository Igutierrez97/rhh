"use client";
import React, { useState } from "react";
import { useModal } from "../Modal/context/ModalContext";
import { FormDataInterface } from "./interfaces/formData";
import { http } from "./http/http";
import { UserInterface } from "@/interfaces";

interface FormAddUserProps {
  onAddUser: (newUser: UserInterface) => void;
}

const FormAddUser = ({ onAddUser }: FormAddUserProps) => {
  const options = ["USER", "ADMIN"];
  const { closeCreateModal } = useModal();
  const [errors, setErrors] = useState<Partial<FormDataInterface>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataInterface>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      role: value,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formErrors: Partial<FormDataInterface> = {};
    setGeneralError(null);

    // Validar que todos los campos estén llenos
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        formErrors[key as keyof typeof formData] =
          key === "confirmPassword"
            ? "Confirmar contraseña no puede estar vacío"
            : key === "name"
            ? "Nombre y apellido no puede estar vacío"
            : `${key.charAt(0).toUpperCase() + key.slice(1)} no puede estar vacío`;
      }
    }

    // Validar el formato del correo electrónico
    if (!validateEmail(formData.email)) {
      formErrors.email = "Correo electrónico no tiene un formato válido";
    }

    // Validar que la contraseña tenga al menos 8 caracteres
    if (formData.password.length < 8) {
      formErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validar que la contraseña y la confirmación coincidan
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "La contraseña no coincide con la confirmación de contraseña";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await http(formData);
      if (res.ok) {
        const data = await res.json();

        // Llamar a la función onAddUser pasando los datos del nuevo usuario
        onAddUser(data);
        closeCreateModal();
      } else {
        setGeneralError("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setGeneralError("Error al enviar la solicitud");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center">
      {generalError && <p className="text-red-500">{generalError}</p>}
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="text"
          placeholder="Nombres y Apellidos"
          className="input input-bordered input-md w-full"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="input input-bordered input-md w-full"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="password"
          placeholder="Contraseña"
          className="input input-bordered input-md w-full"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="password"
          placeholder="Confirme su contraseña"
          className="input input-bordered input-md w-full"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <label className="form-control w-full">
          <select
            value={formData.role}
            onChange={handleSelectChange}
            className="select select-bordered w-full"
          >
            <option disabled value="">
              Rol
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {errors.role && <p className="text-red-500">{errors.role}</p>}
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn bg-green-600 text-white">
          Crear Usuario
        </button>
        <button type="button" className="btn" onClick={closeCreateModal}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormAddUser;
