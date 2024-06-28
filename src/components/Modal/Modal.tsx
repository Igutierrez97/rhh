"use client";
import React, { FC, ReactNode } from "react";
import { useModal } from "./context/ModalContext";
import { EditIcon } from "../icons";

interface ModalProps {
  children: ReactNode;
  title: string;
  option?: boolean;
}

const Modal: FC<ModalProps> = ({ children, title, option }) => {
  const { isOpen, closeModal, openModal } = useModal();

  return (
    <>
      {!option ? (
        <button className="btn bg-blue-600 text-white" onClick={openModal}>
          {title}
        </button>
      ) : (
        <EditIcon width={20} height={20} onClick={openModal} />
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
