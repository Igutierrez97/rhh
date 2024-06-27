"use client";

import { UserInterface } from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { useModal } from "../Modal/context/ModalContext";

export default function UploadFile() {
  const { closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>(
    "No se ha seleccionado archivo"
  );
  const [admins, setAdmins] = useState<UserInterface[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("No se ha seleccionado archivo");
    }
  };

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartment(event.target.value);
  };

  const handleAdminChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdmin(event.target.value);
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admins");
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (
      !fileInputRef.current ||
      !fileInputRef.current.files ||
      fileInputRef.current.files.length === 0
    ) {
      newErrors.file = "El archivo no puede estar vacío";
    }
    if (!department) {
      newErrors.department = "El nombre del departamento no puede estar vacío";
    }
    if (!selectedAdmin) {
      newErrors.admin = "Debes seleccionar un administrador";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    if (fileInputRef.current && fileInputRef.current.files) {
      formData.append("file", fileInputRef.current.files[0]);
    }

    formData.append("depa", department); // Asegúrate de que el nombre coincida con el backend
    formData.append("assignedTo", selectedAdmin);

    try {
      const response = await fetch(
        "http://localhost:3000/api/document/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Error uploading document");
      }

      // Reset form after successful upload
      setFileName("No se ha seleccionado archivo");
      setDepartment("");
      setSelectedAdmin("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      closeModal();
    } catch (error) {
      console.error("Error uploading document:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Error subiendo el documento",
      }));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}
      <div>
        <label
          htmlFor="adminSelect"
          className="block text-gray-700 font-semibold mb-2"
        >
          Asignado a
        </label>
        <select
          id="adminSelect"
          className="select select-bordered w-full max-w-xs"
          value={selectedAdmin}
          onChange={handleAdminChange}
        >
          <option value="" disabled>
            Selecciona un administrador
          </option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.name}
            </option>
          ))}
        </select>
        {errors.admin && (
          <div className="text-red-500 text-sm mt-1">{errors.admin}</div>
        )}
      </div>
      <div>
        <label
          htmlFor="nombreDepartamento"
          className="block text-gray-700 font-semibold mb-2"
        >
          Nombre del Departamento
        </label>
        <input
          id="nombreDepartamento"
          type="text"
          placeholder="Ej. Recursos Humanos"
          className="input input-bordered w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={department}
          onChange={handleDepartmentChange}
        />
        {errors.department && (
          <div className="text-red-500 text-sm mt-1">{errors.department}</div>
        )}
      </div>
      <div>
        <label
          htmlFor="archivo"
          className="block text-gray-700 font-semibold mb-2"
        >
          Archivo
        </label>
        <div className="relative">
          <input
            id="archivo"
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-primary absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="flex items-center justify-start h-12 border border-dashed border-gray-300 rounded-md p-2">
            <button
              type="button"
              className="btn bg-blue-600 py-2 px-4 rounded text-white font-bold hover:bg-blue-700"
              onClick={handleButtonClick}
            >
              Elegir archivo
            </button>
            <span className="ml-3 text-gray-500">{fileName}</span>
          </div>
        </div>
        <span className="text-sm text-gray-500 mt-1 block">
          Formatos permitidos: XLSX
        </span>
        {errors.file && (
          <div className="text-red-500 text-sm mt-1">{errors.file}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn bg-blue-600 w-full py-2 rounded text-white font-bold hover:bg-blue-700"
      >
        Subir Documento
      </button>
    </form>
  );
}
