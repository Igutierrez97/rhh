"use client";
import React, { useState } from "react";
import { useModal } from "../Modal/context/ModalContext";
import { FormDataInterface } from "./interfaces/formData";
import { http } from "./http/http";
import { UserInterface } from "@/interfaces";

interface FormAddUserProps {
  onAddUser: (newUser: UserInterface) => void;
}

const FormAddUser = ({onAddUser}:FormAddUserProps) => {
  const options = ["USER", "ADMIN"];
  const { closeModal } = useModal();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataInterface>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e: any) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { confirmPassword, ...formDataWithoutConfirm } = formData;

    for (const key in formDataWithoutConfirm) {
      if (Object.prototype.hasOwnProperty.call(formDataWithoutConfirm, key)) {
        const value =
          formDataWithoutConfirm[key as keyof typeof formDataWithoutConfirm];
        if (value === "") {
          setError(`${key} no puede estar vacío`);
          return;
        }
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Contraseña no coincide con confirmar contraseña");
    } else {
      try {
        const res = await http(formData);
        if (res.ok) {
          const data = await res.json();
         

          // Llamar a la función onAddUser pasando los datos del nuevo usuario
          onAddUser(data);
        } else {
          console.error("Error al enviar el formulario");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        console.log(error); // Logging the error here
      }
    }
    
    closeModal()
};
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center">
      <input
        type="text"
        placeholder="Nombres y Apellidos"
        className="input input-bordered input-md w-full max-w-xs"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Correo Electronico"
        className="input input-bordered input-md w-full max-w-xs"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="input input-bordered input-md w-full max-w-xs"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Confirme su contraseña"
        className="input input-bordered input-md w-full max-w-xs"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <label className="form-control w-full max-w-xs">
        <select
          value={formData.role}
          onChange={handleSelectChange}
          className="select select-bordered w-full max-w-xs"
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
      <div>
        <button type="submit" className="btn mr-3 bg-green-600 text-white">
          Crear Usuario
        </button>
        <button type="button" className="btn mr-3" onClick={closeModal}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormAddUser;
