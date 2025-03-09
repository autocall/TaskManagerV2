import { Button, Modal, Spinner } from "react-bootstrap";
import { ProfileTimeZoneModel } from "../services/models/timezone.model";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    gettingProfileTimeZoneAction,
    gotProfileTimeZoneAction,
    submittingProfileTimeZoneAction,
    submittedProfileTimeZoneAction,
    closeProfileTimeZoneAction,
    ProfileTimeZoneState,
} from "../states/profile.timezone.state";
import useAsyncEffect from "use-async-effect";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";
import profileService from "../services/profile.service";

interface ProfileTimeZoneModalProps {
    modalData: ProfileTimeZoneModel | null;
    onClose: (reload: boolean) => void;
}

const ProfileTimeZoneModal: React.FC<ProfileTimeZoneModalProps> = ({ modalData, onClose }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.profileTimeZoneState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            let service: profileService = new profileService(testHelper.getTestContainer(search));
            dispatch(gettingProfileTimeZoneAction());
            let response = await service.getTimeZones();
            dispatch(gotProfileTimeZoneAction(response));
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
        TimeZoneId: Yup.string().required("This field is required!"),
    });

    const handleSubmit = async (model: ProfileTimeZoneState) => {
        let service: profileService = new profileService(testHelper.getTestContainer(search));
        dispatch(submittingProfileTimeZoneAction());
        let response = await service.setTimeZoneId(model.TimeZoneId);
        dispatch(submittedProfileTimeZoneAction(response));
        if (response.success) {
            onClose(true);
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeProfileTimeZoneAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modify TimeZone</Modal.Title>
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
                                    <FormGroup error={touched.TimeZoneId && (errors.TimeZoneId ?? state.errors.TimeZoneId)}>
                                        <Field as="select" name="TimeZoneId" className="form-control">
                                            <option value="">Select TimeZone</option>
                                            {state.TimeZones.map((x) => (
                                                <option key={x.Id} value={x.Id}>
                                                    {x.DisplayName}
                                                </option>
                                            ))}
                                        </Field>
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

export default ProfileTimeZoneModal;
