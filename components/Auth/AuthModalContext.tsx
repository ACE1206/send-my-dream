// // Контекст модального окна авторизации
//
// import React, { createContext, useState, useContext, ReactNode } from 'react';
// import AuthModal from "../Modal/AuthModal";
//
// interface AuthModalContextProps {
//     isAuthModalOpen: boolean;
//     openAuthModal: () => void;
//     closeAuthModal: () => void;
// }
//
// const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);
//
// export const useAuthModal = () => {
//     const context = useContext(AuthModalContext);
//     if (!context) {
//         throw new Error('useAuthModal must be used within an AuthModalProvider');
//     }
//     return context;
// };
//
// export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//
//     const openAuthModal = () => setIsAuthModalOpen(true);
//     const closeAuthModal = () => setIsAuthModalOpen(false);
//
//     return (
//         <AuthModalContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal }}>
//             {children}
//             {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
//         </AuthModalContext.Provider>
//     );
// };
