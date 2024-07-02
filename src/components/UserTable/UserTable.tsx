'use client'
import React, { useEffect, useState } from "react";
import { UserInterface } from "@/interfaces";
import { DeleteIcon, EditIcon } from "../icons";
import { Modal } from "../Modal";
import { EditUserForm } from "../EditUserForm";
import { useModal } from "../Modal/context/ModalContext";
import { Loading } from "../Loading";

export async function deleteData(id: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return true; // Devuelve true si la eliminación fue exitosa
    } else {
      console.error("Error en la eliminación del usuario:", response.status);
      return false; // Devuelve false si hubo un problema con la solicitud
    }
  } catch (error) {
    console.error("Error en la eliminación del usuario:", error);
    return false; // Devuelve false si hubo un error en la solicitud
  }
}

interface UserTableProps {
  initialUsers: UserInterface[];
}

const UserTable: React.FC<UserTableProps> = ({ initialUsers }) => {
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserInterface | null>(null);
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const { openEditModal } = useModal();

  useEffect(() => {
    // Simula una carga inicial con un retardo
    const timer = setTimeout(() => {
      setUsers(initialUsers);
      setLoading(false); // Cuando se carguen los datos, se desactiva el estado de carga
    }, 1000); // Simula una carga de 1 segundo (ajusta según tu lógica real o eliminación del temporizador)

    return () => clearTimeout(timer); // Limpia el temporizador en la limpieza de efectos
  }, [initialUsers ]);

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        const success = await deleteData(userToDelete.id); // Llama a tu función para eliminar el usuario
        if (success) {
          // Actualiza el estado eliminando el usuario
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userToDelete!.id)
          );
          setUserToDelete(null); // Reinicia el estado después de eliminar
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const confirmDelete = (user: UserInterface) => {
    setUserToDelete(user);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-start relative">
      {loading && ( // Mostrar un indicador de carga mientras se carga
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <Loading/>
        </div>
      )}
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Role</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="flex gap-3 relative">
                  {/* Modal de Edición */}
                  <EditIcon width={20} height={20} onClick={() => { setUserToEdit(user); openEditModal() }} />

                  {/* Icono de Eliminar */}
                  <div className="tooltip" data-tip="Eliminar">
                    <DeleteIcon
                      onClick={() => confirmDelete(user)}
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                  </div>

                  {userToEdit === user && (
                    <Modal title="Editar usuario" key={user.id} option="edit">
                      <EditUserForm user={userToEdit} />
                    </Modal>
                  )}

                  {userToDelete === user && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="modal-box bg-white p-4 rounded shadow-md border border-gray-200">
                        <p className="mb-2">
                          ¿Estás seguro que deseas eliminar al usuario{" "}
                          {userToDelete.name}?
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
      </div>
    </div>
  );
};

export default UserTable;
