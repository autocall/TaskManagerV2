import React from "react";

interface Props {
    children: React.ReactNode;
}

const Divider = ({ children }: Props) => {
    return (
        <div className="d-flex align-items-center text-center my-1">
            <div className="flex-grow-1 border-bottom"></div>
            {children}
            <div className="flex-grow-1 border-bottom"></div>
        </div>
    );
};
export default Divider;
