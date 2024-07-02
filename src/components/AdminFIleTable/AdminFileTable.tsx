"use client";
import { Files } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { Loading } from "../Loading";
import { Badge } from "../Badge";
import { DownloadIcon, PayIcon } from "../icons";
import { useModal } from "../Modal/context/ModalContext";
import { Modal } from "../Modal";

export default function DataTable() {
  const { openEditModal, isEditOpen, closeEditModal } = useModal();
  const [data, setData] = useState<Files[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<Files | null>(null);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/asignedme");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [closeEditModal]);

  const handlePayClick = (file: Files) => {
    setSelectedFile(file);
    openEditModal();
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !amount) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/pay/${selectedFile.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalDinero: amount }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Optionally, handle the response or update the state here
      closeEditModal();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[450px] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Departamento</th>
            <th>Fecha</th>
            <th>Subido por</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.depar}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{item.uploadedBy.name}</td>
              <td>
                <Badge content={item.status.toLocaleUpperCase()} />
              </td>
              <td className="flex gap-3">
                <div className="tooltip" data-tip="Descargar">
                  <DownloadIcon href={item.path} />
                </div>
                <div
                  className="tooltip"
                  data-tip="Procesar Pago"
                  onClick={() => handlePayClick(item)}
                >
                  <PayIcon />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditOpen && (
        <Modal title="Monto a repatir">
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handlePaymentSubmit}
          >
            <input
              type="text"
              placeholder="Introducir Monto"
              className="input input-bordered w-1/2 max-w-xs "
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex gap-6 mt-3">
              <button className="btn bg-green-600 text-white" type="submit">
                Aceptar
              </button>
              <button
                className="btn bg-red-600 text-white"
                type="button"
                onClick={closeEditModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
