'use client'
import { UserInterface } from "@/interfaces";
import { useState } from "react";
import { useModal } from "../Modal/context/ModalContext";

interface EditUserFormProps {
  user: UserInterface;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {
  const { closeEditModal } = useModal();
  const options = ["USER", "ADMIN"];
  const [userId, setUserId] = useState(user.id);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: "", // Limpia el error cuando el campo cambia
    }));
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: "", // Limpia el error cuando el campo cambia
    }));
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: "", // Limpia el error cuando el campo cambia
      confirmPassword: "", // Limpia el error de confirmación de contraseña
    }));
  };

  const handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: "", // Limpia el error cuando el campo cambia
    }));
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: "", // Limpia el error cuando el campo cambia
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (email && !isValidEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Formato de email inválido",
      }));
      isValid = false;
    }

    if (password.length > 0 && password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "La contraseña debe tener al menos 8 caracteres",
      }));
      isValid = false;
    }

    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      isValid = false;
    }

    return isValid;
  };

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
          role,
        }),
      });

      if (response.ok) {
        closeEditModal(); // Cierra el modal después de una actualización exitosa
        // Puedes realizar otras acciones después de la actualización aquí
      } else {
        console.error("Error al actualizar el usuario:", response.status);
        setErrors({
          ...errors,
          general: "Error al actualizar el usuario. Inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setErrors({
        ...errors,
        general: "Error al actualizar el usuario. Inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleCancel = () => {
    closeEditModal();
  };

  return (
    <form
      className="flex flex-col gap-3 items-center"
      onSubmit={handleUpdateUser}
    >
      {errors.general && <p className="text-red-500">{errors.general}</p>}
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="text"
          placeholder="Nombres y Apellidos"
          className="input input-bordered input-md w-full"
          name="name"
          value={name}
          onChange={handleChangeName}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="text"
          placeholder="Correo Electrónico"
          className="input input-bordered input-md w-full"
          name="email"
          value={email}
          onChange={handleChangeEmail}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="password"
          placeholder="Contraseña"
          className="input input-bordered input-md w-full"
          name="password"
          value={password}
          onChange={handleChangePassword}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <input
          type="password"
          placeholder="Confirme su contraseña"
          className="input input-bordered input-md w-full"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <label className="form-control w-full">
          <select
            value={role}
            className="select select-bordered w-full"
            onChange={handleChangeRole}
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
          Guardar Cambios
        </button>
        <button type="button" className="btn" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
