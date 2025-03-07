import React from "react";
import Form from "react-bootstrap/Form";

interface Props {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    error?: any;
}

const FormGroup = ({ children, as, className, error }: Props) => {
    return (
        <Form.Group as={as} className={"form-group w-100 " + (className ? `${className} ` : "") + (error ? "invalid" : "")}>
            <div className="d-flex justify-content-end">{children}</div>
            {error && <div className="error p-0">{error}</div>}
        </Form.Group>
    );
};
export default FormGroup;
