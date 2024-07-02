'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextProps {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe usarse dentro de un ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openCreateModal = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  return (
    <ModalContext.Provider value={{ isCreateOpen, isEditOpen, openCreateModal, closeCreateModal, openEditModal, closeEditModal }}>
      {children}
    </ModalContext.Provider>
  );
};

