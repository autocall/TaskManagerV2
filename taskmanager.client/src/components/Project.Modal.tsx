import { Button, Modal, Spinner } from "react-bootstrap";
import ProjectModel from "../services/models/project.model";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    createProjectAction,
    gettingProjectAction,
    gotProjectAction,
    submittingProjectAction,
    submittedProjectAction,
    closeProjectAction,
    ProjectState,
} from "../states/project.state";
import useAsyncEffect from "use-async-effect";
import projectService from "../services/project.service";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";

interface ProjectModalProps {
    modalData: ProjectModel | null;
    onClose: (reload: boolean) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ modalData, onClose }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.projectState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            if (modalData.Id) {
                let service: projectService = new projectService(testHelper.getTestContainer(search));
                dispatch(gettingProjectAction());
                let response = await service.get(modalData.Id);
                dispatch(gotProjectAction(response));
            } else {
                dispatch(createProjectAction());
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

    const handleSubmit = async (model: ProjectState) => {
        let service: projectService = new projectService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingProjectAction());
            let response = await service.update(modalData.Id, model.Name);
            dispatch(submittedProjectAction(response));
            if (response.success) {
                handleClose(true);
            }
        } else {
            dispatch(submittingProjectAction());
            let response = await service.create(model.Name);
            dispatch(submittedProjectAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeProjectAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{modalData?.Id ? "Edit" : "Add"} Project</Modal.Title>
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
                                    <FormGroup error={touched.Name && (errors.Name ?? state.errors.Name)}>
                                        <Field name="Name" placeholder="Name" className="form-control" />
                                    </FormGroup>
                                </Modal.Body>

                                <Modal.Footer>
                                    <FormGroup error={state.error}>
                                        <div>
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

export default ProjectModal;
