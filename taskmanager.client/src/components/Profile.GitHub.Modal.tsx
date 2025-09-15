import { Button, Modal, Spinner } from "react-bootstrap";
import { ProfileGitHubModel } from "../services/models/github.model";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    gettingProfileGitHubAction,
    gotProfileGitHubAction,
    submittingProfileGitHubAction,
    submittedProfileGitHubAction,
    closeProfileGitHubAction,
    ProfileGitHubState,
} from "../states/profile.github.state";
import useAsyncEffect from "use-async-effect";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";
import profileService from "../services/profile.service";

interface ProfileGitHubModalProps {
    modalData: ProfileGitHubModel | null;
    onClose: (reload: boolean) => void;
}

const ProfileGitHubModal: React.FC<ProfileGitHubModalProps> = ({ modalData, onClose }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.profileGitHubState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            let service = new profileService(testHelper.getTestContainer(search));
            dispatch(gettingProfileGitHubAction());
            let response = await service.getGitHub();
            dispatch(gotProfileGitHubAction(response));
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
    });

    const handleSubmit = async (model: ProfileGitHubState) => {
        let service = new profileService(testHelper.getTestContainer(search));
        dispatch(submittingProfileGitHubAction());
        let response = await service.setGitHub(model.Owner, model.Token);
        dispatch(submittedProfileGitHubAction(response));
        if (response.success) {
            onClose(true);
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeProfileGitHubAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modify GitHub Profile</Modal.Title>
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
                                    <FormGroup error={touched.Owner && (errors.Owner ?? state.errors.Owner)}>
                                        <Field name="Owner" placeholder="Owner" className="form-control" />
                                    </FormGroup>
                                    <FormGroup error={touched.Token && (errors.Token ?? state.errors.Token)}>
                                        <Field name="Token" placeholder="Token" className="form-control" />
                                    </FormGroup>
                                </Modal.Body>

                                <Modal.Footer>
                                    <FormGroup error={state.error} className="text-end">
                                        <div className="d-flex justify-content-end">
                                            <div className="ms-auto">
                                                <Button variant="secondary" onClick={() => handleClose(false)}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" type="submit" disabled={state.submitting}>
                                                    {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                                    {!state.submitting && <span>Save</span>}
                                                </Button>
                                            </div>
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

export default ProfileGitHubModal;
