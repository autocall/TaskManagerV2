import { Link } from "react-router-dom";
import CategoryModel from "../../services/models/category.model";

interface Props {
    model: CategoryModel;
}

const Divider = ({ model }: Props) => {
    return (
        <div className="d-flex align-items-center text-center my-1">
            <div className="flex-grow-1 border-bottom" css={{ borderColor: model.Color + " !important" }}></div>
            <div className="mx-3"><span style={{ color: model.Color }}>{model.Name}</span></div>
            <div className="flex-grow-1 border-bottom" css={{ borderColor: model.Color + " !important"  }}></div>
        </div>
    );
};
export default Divider;
