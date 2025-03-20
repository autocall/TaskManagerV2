import { Button, ButtonGroup, Modal, Spinner, ToggleButton } from "react-bootstrap";
import CommentModel, { CommentData } from "../services/models/comment.model";
import { Formik, Field, FormikProps } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    createCommentAction,
    gettingCommentAction,
    gotCommentAction,
    submittingCommentAction,
    submittedCommentAction,
    closeCommentAction,
    CommentState,
} from "../states/comment.state";
import useAsyncEffect from "use-async-effect";
import commentService from "../services/comment.service";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";
import { useConfirm } from "./shared/confirm";
import { useRef, useState } from "react";
import CategoryModel from "../services/models/category.model";
import ProjectModel from "../services/models/project.model";
import overviewService from "../services/overview.service";
import { getTaskStatusDescription, getTaskStatusVariant, TaskStatusEnum } from "../enums/task.status.enum";

interface CommentModalProps {
    modalData: CommentModel | null;
    onClose: (reload: boolean) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ modalData, onClose }) => {
    const formikRef = useRef<FormikProps<CommentState>>(null);
    const { search } = useLocation();
    const [categories, setCategories] = useState<CategoryModel[] | null>(null);
    const [projects, setProjects] = useState<ProjectModel[] | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.commentState);

    useAsyncEffect(async () => {
        setProjects(overviewService.projects);
        setCategories(overviewService.categories);

        if (modalData != null) {
            if (modalData.Id) {
                let service: commentService = new commentService(testHelper.getTestContainer(search));
                dispatch(gettingCommentAction());
                let response = await service.get(modalData.Id);
                dispatch(gotCommentAction(response));
            } else {
                dispatch(createCommentAction(modalData));
            }
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
        Text: Yup.string()
            .test(
                "len",
                "The name must be between 2 and 64 characters.",
                (val: any) => val && val.toString().length >= 2 && val.toString().length <= 64,
            )
            .required("This field is required!"),
    });

    const handleSubmit = async (model: CommentState) => {
        let service: commentService = new commentService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingCommentAction());
            let response = await service.update(modalData.Id, new CommentData(model));
            dispatch(submittedCommentAction(response));
            if (response.success) {
                handleClose(true);
            }
        } else {
            dispatch(submittingCommentAction());
            let response = await service.create(new CommentData(model));
            dispatch(submittedCommentAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!modalData?.Id) return;
        if (await confirm("Delete Comment", `Are you sure you want to delete the comment?`)) {
            let service: commentService = new commentService(testHelper.getTestContainer(search));
            dispatch(submittingCommentAction());
            let response = await service.delete(modalData.Id);
            dispatch(submittedCommentAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeCommentAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)} size="lg" backdrop="static">
            {ConfirmDialog}
            <Modal.Header closeButton>
                <Modal.Title>
                    {modalData?.Id ? "Edit" : "Add"} Comment for Task {modalData?.TaskIndex}
                </Modal.Title>
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
                                    <FormGroup label="Date" error={touched.Date && (errors.Date ?? state.errors.Date)}>
                                        <Field type="Date" name="Date" placeholder="Date" className="form-control" />
                                    </FormGroup>
                                    <FormGroup label="Status" error={touched.Status && (errors.Status ?? state.errors.Status)}>
                                        <ButtonGroup>
                                            {(Object.values(TaskStatusEnum) as TaskStatusEnum[])
                                                .filter((k) => Number(k))
                                                .map((status) => (
                                                    <ToggleButton
                                                        key={"comment-status" + status}
                                                        id={"comment-status" + status}
                                                        type="radio"
                                                        variant={values.Status == status ? getTaskStatusVariant(values.Status) : "outline-secondary"}
                                                        name="radio"
                                                        value={status}
                                                        checked={values.Status == status}
                                                        onChange={(e) => setFieldValue("Status", status)}>
                                                        {getTaskStatusDescription(status)}
                                                    </ToggleButton>
                                                ))}
                                        </ButtonGroup>
                                    </FormGroup>
                                    <FormGroup label="Text" error={touched.Text && (errors.Text ?? state.errors.Text)}>
                                        <Field as="textarea" name="Text" placeholder="Text" className="form-control" />
                                    </FormGroup>
                                </Modal.Body>
                                <Modal.Footer>
                                    <FormGroup error={state.error}>
                                        <div className="d-flex justify-content-end">
                                            {modalData?.Id && (
                                                <div className="me-auto">
                                                    <Button variant="danger" onClick={() => handleDelete()} disabled={state.submitting}>
                                                        {state.submitting ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            <span>Delete</span>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                            <div>
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

export default CommentModal;
