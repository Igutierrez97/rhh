"use client";
import React, { FC, ReactNode } from "react";
import { useModal } from "./context/ModalContext";
import { EditIcon } from "../icons";

interface ModalProps {
  children: ReactNode;
  title: string;
  option?: "create" | "edit";
}

const Modal: FC<ModalProps> = ({ children, title, option }) => {
  const {
    isCreateOpen,
    isEditOpen,
    closeCreateModal,
    closeEditModal,
    openCreateModal,
    openEditModal,
  } = useModal();

  const isOpen = option === "create" ? isCreateOpen : isEditOpen;
  const closeModal = option === "create" ? closeCreateModal : closeEditModal;
  const openModal = option === "create" ? openCreateModal : openEditModal;

  return (
    <>
      {option === "create" ? (
        <button className="btn bg-blue-600 text-white" onClick={openModal}>
          {title}
        </button>
      ) : (
        null
      )}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <div className="flex items-center justify-between w-full mb-3 ">
              <p className="uppercase">{title}</p>
              <button
                className="text-red-400 text-xl hover:bg-red-400 font-bold hover:text-white w-5 h-5 rounded-full flex items-center justify-center"
                onClick={closeModal}
              >
                <p>&times;</p>
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
