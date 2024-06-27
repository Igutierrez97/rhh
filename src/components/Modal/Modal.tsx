"use client";
import React, { ReactNode } from "react";
import { useModal } from "./context/ModalContext";

interface ModalProps {
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, title }) => {
  const { isOpen, closeModal, openModal } = useModal();

  return (
    <>
      <button className="btn bg-blue-600 text-white" onClick={openModal}>
        {title}
      </button>
      {isOpen && ( // Evaluación de isOpen para mostrar el modal
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <div className="flex items-center justify-between w-full mb-3 ">
              <p className="uppercase">{title}</p>

              <button
                className="text-red-400 text-xl hover:bg-red-400 font-bold hover:text-white w-5 h-5 rounded-full flex items-center justify-center "
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
