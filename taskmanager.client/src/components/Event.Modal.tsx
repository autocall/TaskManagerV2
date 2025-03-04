import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import EventModel, { EventData, IEventData } from "../services/models/event.model";
import { Formik, Field, useFormikContext, FormikProps } from "formik";
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
import { EventTypeEnum } from "../enums/event.type.enum";
import { EventRepeatEnum } from "../enums/event.repeat.enum";
import { useConfirm } from "./shared/confirm";
import { useRef } from "react";

interface EventModalProps {
    modalData: EventModel | null;
    onClose: (reload: boolean) => void;
}

const EventModal: React.FC<EventModalProps> = ({ modalData, onClose }) => {
    const formikRef = useRef<FormikProps<EventState>>(null);
    const { search } = useLocation();
    const { confirm, ConfirmDialog } = useConfirm();
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
        Date: Yup.string().required("This field is required!"),
        Name: Yup.string()
            .test(
                "len",
                "The name must be between 2 and 64 characters.",
                (val: any) => val && val.toString().length >= 2 && val.toString().length <= 64,
            )
            .required("This field is required!"),
        RepeatValue: Yup.number().when("RepeatType", {
            is: (val: EventRepeatEnum) => val !== EventRepeatEnum.Default,
            then: (schema) => schema.min(1, "This field is required!"),
        }),
    });

    const handleSubmit = async (model: EventState) => {
        let service: eventService = new eventService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingEventAction());
            let response = await service.update(modalData.Id, new EventData(model));
            dispatch(submittedEventAction(response));
            if (response.success) {
                handleClose(true);
            }
        } else {
            dispatch(submittingEventAction());
            let response = await service.create(new EventData(model));
            dispatch(submittedEventAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!modalData?.Id) return;
        if (await confirm("Delete Event", `Are you sure you want to delete the event '${modalData.Name}'?`)) {
            let service: eventService = new eventService(testHelper.getTestContainer(search));
            dispatch(submittingEventAction());
            let response = await service.delete(modalData.Id);
            dispatch(submittedEventAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeEventAction());
        onClose(reload);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!formikRef.current) return;
        let type = parseInt(e.target.value);
        formikRef.current.setFieldValue("Type", type);
        if (type == EventTypeEnum.Birthday) {
            formikRef.current.setFieldValue("RepeatType", EventRepeatEnum.Years);
            formikRef.current.setFieldValue("RepeatValue", 1);
        }
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)}>
            {ConfirmDialog}
            <Modal.Header closeButton>
                <Modal.Title>{modalData?.Id ? "Edit" : "Add"} Event</Modal.Title>
            </Modal.Header>
            {state.loading ? (
                <div className="text-center m-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Formik innerRef={formikRef} initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <fieldset disabled={state.loaded == false}>
                                <Modal.Body>
                                    <FormGroup error={touched.Date && (errors.Date ?? state.errors.Date)}>
                                        <Form.Label>Date</Form.Label>
                                        <Field type="Date" name="Date" placeholder="Date" className="form-control" />
                                    </FormGroup>
                                    <FormGroup error={touched.Type && (errors.Type ?? state.errors.Type)}>
                                        <Form.Label>Type</Form.Label>
                                        <Field as="select" name="Type" className="form-control" onChange={handleTypeChange}>
                                            <option value={EventTypeEnum.Default}>Default</option>
                                            <option value={EventTypeEnum.Task}>Task</option>
                                            <option value={EventTypeEnum.Birthday}>Birthday</option>
                                            <option value={EventTypeEnum.Holiday}>Holiday</option>
                                        </Field>
                                    </FormGroup>
                                    <FormGroup error={touched.Name && (errors.Name ?? state.errors.Name)}>
                                        <Form.Label>Name</Form.Label>
                                        <Field name="Name" placeholder="Name" className="form-control" />
                                    </FormGroup>
                                    <FormGroup error={touched.Description && (errors.Description ?? state.errors.Description)}>
                                        <Form.Label>Description</Form.Label>
                                        <Field as="textarea" name="Description" placeholder="Description" className="form-control" />
                                    </FormGroup>
                                    <Row>
                                        <Form.Label>Repeat</Form.Label>
                                        <FormGroup as={Col} error={touched.RepeatType && (errors.RepeatType ?? state.errors.RepeatType)}>
                                            <Field as="select" name="RepeatType" className="form-control">
                                                <option value={EventRepeatEnum.Default}>Default</option>
                                                <option value={EventRepeatEnum.Days}>Days</option>
                                                <option value={EventRepeatEnum.Weeks}>Weeks</option>
                                                <option value={EventRepeatEnum.Months}>Months</option>
                                                <option value={EventRepeatEnum.Years}>Years</option>
                                            </Field>
                                        </FormGroup>
                                        <FormGroup as={Col} error={touched.RepeatValue && (errors.RepeatValue ?? state.errors.RepeatValue)}>
                                            <Field
                                                type="number"
                                                name="RepeatValue"
                                                placeholder="RepeatValue"
                                                className="form-control"
                                                disabled={values.RepeatType == EventRepeatEnum.Default}
                                            />
                                        </FormGroup>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <FormGroup error={state.error}>
                                        {modalData?.Id && (
                                            <div>
                                                <Button variant="danger" onClick={() => handleDelete()} disabled={state.submitting}>
                                                    {state.submitting ? (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    ) : (
                                                        <span>Delete</span>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                        <div className="ms-auto">
                                            <Button variant="secondary" onClick={() => handleClose(false)} disabled={state.submitting}>
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit" disabled={state.submitting}>
                                                {state.submitting ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    <span>Save</span>
                                                )}
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

export default EventModal;
