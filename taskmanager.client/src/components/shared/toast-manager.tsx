import { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
    toast: (options: { message: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("\\");
    const [type, setType] = useState<ToastType>("success");

    const trigger = ({ message, type = "info" }: { message: string; type?: ToastType }) => {
        setMessage(message);
        setType(type);
        setShow(true);
    };

    return (
        <ToastContext.Provider value={{ toast: trigger }}>
            {children}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={type} show={show} onClose={() => setShow(false)} delay={3000} autohide>
                    <Toast.Body className="text-white">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
