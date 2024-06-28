'use client'
import React, { useState, useEffect } from 'react';
import { FormAddUser, Modal, UserTable } from "@/components";
import { ModalProvider } from "@/components/Modal/context/ModalContext";
import { UserInterface } from "@/interfaces";

function User() {
  const [users, setUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/user")
      .then(res => {
        if (!res.ok) {
          throw new Error("Error en la carga de datos");
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        console.log(data);
      })
      .catch(error => {
        console.error(error);
        // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
      });
  }, []);

  const handleAddUser = (newUser: UserInterface) => {
    setUsers([...users, newUser]);
  };
  console.log('data antes de pasarla como props',users);
  return (
    <div>
      <ModalProvider>
        <Modal title={'Crear Usuario'} option={false}>
          <FormAddUser onAddUser={handleAddUser} />
        </Modal>
        <UserTable initialUsers={users} />
      </ModalProvider>
    </div>
  );
}

export default User;

