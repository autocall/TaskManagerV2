import React from "react";

interface Props {
    children: React.ReactNode;
}

const FormError = ({ children }: Props) => {
    return <span>{children}</span>;
};
export default FormError;
