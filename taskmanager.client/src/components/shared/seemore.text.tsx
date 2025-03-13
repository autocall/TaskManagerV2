import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
    text: string;
    maxLength?: number;
}

const SeeMoreText = ({ text, maxLength = 120 }: Props) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <span>
            {text.length > maxLength ? (expanded ? text + " " : `${text.substring(0, maxLength)}... `) : text}
            {text.length > maxLength && (
                <Link className="badge-text" to="#" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "see less" : "see more"}
                </Link>
            )}
        </span>
    );
};

export default SeeMoreText;
