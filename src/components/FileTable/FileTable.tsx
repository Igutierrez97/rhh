"use client";
import React, { useEffect, useState } from "react";
import { Files } from "@/interfaces";
import { UploadFile } from "../UploadFileForm";
import { Loading } from "../Loading";
import { useModal } from "../Modal/context/ModalContext";
import { Modal } from "../Modal";
import { DeleteIcon, DownloadIcon, EditIcon } from "../icons";
import { Badge } from "../Badge";
import { EditFileForm } from "../EditFileForm";

export default function FileTable() {
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileToDelete, setFileToDelete] = useState<Files | null>(null);
  const [fileToEdit, setFileToEdit] = useState<Files | null>(null);
  const { openCreateModal, openEditModal } = useModal();

  async function deleteData(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/document/other/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        return true;
      } else {
        console.error(
          "Error en la eliminación del documento:",
          response.status
        );
        return false;
      }
    } catch (error) {
      console.error("Error en la eliminación del documento:", error);
      return false;
    }
  }

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/document/view");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [openCreateModal, openEditModal]);

  const confirmDelete = (file: Files) => {
    setFileToDelete(file);
  };

  const handleDelete = async () => {
    if (fileToDelete) {
      const success = await deleteData(fileToDelete.id);
      if (success) {
        setFiles(files.filter((file) => file.id !== fileToDelete.id));
        setFileToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setFileToDelete(null);
  };

  return (
    <>
      <Modal title="Crear Documento" option="create">
        <UploadFile />
      </Modal>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="w-full h-[400px] flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Documento</th>
                <th>Departamento</th>
                <th>Creado</th>
                <th>Asignado A</th>
                <th>Estado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.id}>
                  <th>{index + 1}</th>
                  <td>{file.name}</td>
                  <td>{file.depar}</td>
                  <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td>{file.assignedTo.name}</td>
                  <td>
                    <Badge content={file.status.toUpperCase()} />
                  </td>
                  <td className="flex gap-3 relative">

                    <DownloadIcon href={file.path} />
                    
                    <EditIcon className={`tooltip ${file.status === 'pagado' ? 'pointer-events-none opacity-50' : ''}`} width={20} height={20} onClick={()=>{setFileToEdit(file); openEditModal()}}/>


                    <div className={`tooltip ${file.status === 'pagado' ? 'pointer-events-none opacity-50' : ''}`} data-tip="Eliminar">
                    <DeleteIcon
                      onClick={() => confirmDelete(file)}
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                    </div>

                    {fileToEdit !== null && (
                      <Modal title="Editar Documento" option="edit">
                        <EditFileForm file={fileToEdit}/>
                      </Modal>
                    )
                    
                    }
                    
                    {fileToDelete === file && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal-box bg-white p-4 rounded shadow-md border border-gray-200">
                          <p className="mb-2">
                            ¿Estás seguro que deseas eliminar el documento "
                            {fileToDelete.name}"?
                          </p>
                          <div className="flex justify-center">
                            <button
                              onClick={handleDelete}
                              className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
