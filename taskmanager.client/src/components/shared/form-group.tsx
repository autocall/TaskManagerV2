import React from "react";
import Form from "react-bootstrap/Form";

interface Props {
    children: React.ReactNode;
    label?: string;
    as?: React.ElementType;
    className?: string;
    error?: any;
}

const FormGroup = ({ children, label, as, className, error }: Props) => {
    return (
        <>
            {label && <Form.Label>{label}</Form.Label>}
            <Form.Group as={as} className={"form-group w-100 " + (className ? `${className} ` : "") + (error ? "invalid" : "")}>
                {children}
                {error && <div className="error p-0">{error}</div>}
            </Form.Group>
        </>
    );
};
export default FormGroup;
