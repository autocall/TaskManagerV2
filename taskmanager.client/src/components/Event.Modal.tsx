import { Button, Modal, Spinner } from "react-bootstrap";
import EventModel, { EventData, EventDataFactory, ExtendedEventData } from "../services/models/event.model";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    createEventAction,
    gettingEventAction,
    gotEventAction,
    submittingEventAction,
    submittedEventAction,
    closeEventAction,
    EventState,
} from "../states/event.state";
import useAsyncEffect from "use-async-effect";
import eventService from "../services/event.service";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";

interface EventModalProps {
    modalData: EventModel | null;
    onClose: (reload: boolean) => void;
}

const EventModal: React.FC<EventModalProps> = ({ modalData, onClose }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.eventState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            if (modalData.Id) {
                let service: eventService = new eventService(testHelper.getTestContainer(search));
                dispatch(gettingEventAction());
                let response = await service.get(modalData.Id);
                dispatch(gotEventAction(response));
            } else {
                dispatch(createEventAction(modalData));
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

    const handleSubmit = async (model: EventState) => {
        let service: eventService = new eventService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingEventAction());
            let response = await service.update(modalData.Id, new EventData(model));
            dispatch(submittedEventAction(response));
            if (response.success) {
                onClose(true);
            }
        } else {
            dispatch(submittingEventAction());
            let response = await service.create(new EventData(model));
            dispatch(submittedEventAction(response));
            if (response.success) {
                onClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeEventAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{modalData?.Id ? "Edit" : "Add"} Event</Modal.Title>
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
                                    <FormGroup error={touched.Date && (errors.Date ?? state.errors.Date)}>
                                        <Field type="Date" name="DateString" placeholder="Date" className="form-control" />
                                    </FormGroup>
                                    <FormGroup error={touched.Name && (errors.Name ?? state.errors.Name)}>
                                        <Field name="Name" placeholder="Name" className="form-control" />
                                    </FormGroup>
                                </Modal.Body>

                                <Modal.Footer>
                                    <FormGroup error={state.error} className="text-end">
                                        <Button variant="secondary" onClick={() => handleClose(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" disabled={state.submitting}>
                                            {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                            {!state.submitting && <span>Save</span>}
                                        </Button>
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

export default EventModal;
