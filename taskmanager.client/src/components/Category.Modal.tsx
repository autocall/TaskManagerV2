import { Button, Modal, Spinner } from "react-bootstrap";
import CategoryModel from "../services/models/category.model";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    createCategoryAction,
    gettingCategoryAction,
    gotCategoryAction,
    submittingCategoryAction,
    submittedCategoryAction,
    closeCategoryAction,
    CategoryState,
} from "../states/category.state";
import useAsyncEffect from "use-async-effect";
import categoryService from "../services/category.service";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";

interface CategoryModalProps {
    modalData: CategoryModel | null;
    onClose: (reload: boolean) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ modalData, onClose }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.categoryState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            if (modalData.Id) {
                let service: categoryService = new categoryService(testHelper.getTestContainer(search));
                dispatch(gettingCategoryAction());
                let response = await service.get(modalData.Id);
                dispatch(gotCategoryAction(response));
            } else {
                dispatch(createCategoryAction());
            }
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
        Name: Yup.string()
            .test(
                "len",
                "The name must be between 2 and 64 characters.",
                (val: any) => val && val.toString().length >= 2 && val.toString().length <= 64,
            )
            .required("This field is required!"),
    });

    const handleSubmit = async (model: CategoryState) => {
        let service: categoryService = new categoryService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingCategoryAction());
            let response = await service.update(modalData.Id, model.Name, model.Color);
            dispatch(submittedCategoryAction(response));
            if (response.success) {
                handleClose(true);
            }
        } else {
            dispatch(submittingCategoryAction());
            let response = await service.create(model.Name, model.Color);
            dispatch(submittedCategoryAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeCategoryAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{modalData?.Id ? "Edit" : "Add"} Category</Modal.Title>
            </Modal.Header>
            {state.loading ? (
                <div className="text-center m-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Formik initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <fieldset disabled={state.loaded == false}>
                                <Modal.Body>
                                    <Form.Label>Name</Form.Label>
                                    <FormGroup error={touched.Name && (errors.Name ?? state.errors.Name)}>
                                        <Field name="Name" placeholder="Name" className="form-control" />
                                    </FormGroup>
                                    <Form.Label>Color</Form.Label>
                                    <FormGroup error={touched.Color && (errors.Color ?? state.errors.Color)}>
                                        <Field type="color" name="Color" placeholder="Color" className="form-control form-control-color" />
                                    </FormGroup>
                                </Modal.Body>

                                <Modal.Footer>
                                    <FormGroup error={state.error}>
                                        <div className="ms-auto">
                                            <Button variant="secondary" onClick={() => handleClose(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit" disabled={state.submitting}>
                                                {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                                {!state.submitting && <span>Save</span>}
                                            </Button>
                                        </div>
                                    </FormGroup>
                                </Modal.Footer>
                            </fieldset>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    );
};

export default CategoryModal;
