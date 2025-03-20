import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

interface Props {
    readonly initialValue: number;
    onChange: (v: number) => void;
}

const FieldHours = ({ initialValue, onChange }: Props) => {
    const [value, setValue] = useState<string>(initialValue.toString());

    // Handle manual input with validation (only numbers and a decimal point)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow only numbers and a single decimal point
        if (/^\d{0,2}([.,]5?)?$/.test(inputValue)) {
            setValueAndOnChange(inputValue);
        }
    };

    const setValueAndOnChange = (inputValue: string) => {
        onChange(parseNumber(inputValue));
        setValue(inputValue);
    };

    const parseNumber = (v: string) => parseFloat(v == "" ? "0" : v.replace(",", "."));

    // Increase value by 0.5
    const increaseValue = () => setValueAndOnChange((parseNumber(value) + 0.5).toFixed(1).toString());

    // Decrease value by 0.5 (ensuring it doesn't go below zero)
    const decreaseValue = () =>
        setValueAndOnChange(
            Math.max(0, parseNumber(value) - 0.5)
                .toFixed(1)
                .toString(),
        );

    return (
        <>
            <div className="input-group">
                <input type="text" className="form-control" value={value} onChange={handleChange} />
                <Button variant="outline-secondary" className="btn-icon" onClick={decreaseValue}>
                    −
                </Button>
                <Button variant="outline-secondary" className="btn-icon" onClick={increaseValue}>
                    +
                </Button>
            </div>
        </>
    );
};

export default FieldHours;
