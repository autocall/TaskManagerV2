import React from "react";
import Form from "react-bootstrap/Form";

interface Props {
    children: React.ReactNode;
    className?: string;
    error?: any;
}

const FormGroup = ({ children, className, error }: Props) => {
    return (
        <Form.Group className={"form-group " + (className ? `${className} ` : "") + (error ? "invalid" : "")}>
            {children}
            {error && <div className="error p-0">{error}</div>}
        </Form.Group>
    );
};
export default FormGroup;
