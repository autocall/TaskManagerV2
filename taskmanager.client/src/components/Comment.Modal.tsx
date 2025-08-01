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
import { Link, useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";
import { useConfirm } from "./shared/confirm";
import { useRef, useState } from "react";
import { getTaskStatusDescription, getTaskStatusVariant, TaskStatusEnum } from "../enums/task.status.enum";
import FieldHours from "./shared/field-hours";
import FileModel from "../services/models/file.model";
import fileExtension from "../extensions/file.extension";
import { getFileIcon } from "../helpers/file-icons";

interface CommentModalProps {
    modalData: CommentModel | null;
    onClose: (reload: boolean) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ modalData, onClose }) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const formikRef = useRef<FormikProps<CommentState>>(null);
    const { search } = useLocation();
    const { confirm, ConfirmDialog } = useConfirm();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.commentState);

    useAsyncEffect(async () => {
        if (modalData != null) {
            if (modalData.Id) {
                let service = new commentService(testHelper.getTestContainer(search));
                dispatch(gettingCommentAction());
                let response = await service.get(modalData.Id);
                dispatch(gotCommentAction(response));
            } else {
                dispatch(createCommentAction(modalData));
            }
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
        Date: Yup.string().required("This field is required!"),
        Status: Yup.number().required("Status is required"),
        Text: Yup.string()
            .test("len", "The name must be at least 2 characters long", (val: any) => val && val.toString().length >= 2)
            .required("This field is required!"),
    });

    const handleFileAttach = (model: CommentState) => {
        const files = fileRef.current?.files;
        console.log("files", files);
        console.log("model.Files", model.Files);
        model.Files?.push(...Array.from(files ?? []).map((f) => FileModel.createFromBlob(f)));
        formikRef.current?.setFieldValue("Files", model.Files);
    };

    const handleFileDelete = (file: FileModel) => {
        file.IsDeleted = !file.IsDeleted;
    };

    const handleSubmit = async (model: CommentState) => {
        let service = new commentService(testHelper.getTestContainer(search));
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
            let service = new commentService(testHelper.getTestContainer(search));
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
                    {modalData?.Id ? "Edit" : "Add"} Comment for Task {state.TaskIndex}
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
                                    <FormGroup label="WorkHours" error={touched.WorkHours && (errors.WorkHours ?? state.errors.WorkHours)}>
                                        <FieldHours initialValue={state.WorkHours} onChange={(h) => setFieldValue("WorkHours", h)} />
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
                                                        onChange={() => setFieldValue("Status", status)}>
                                                        {getTaskStatusDescription(status)}
                                                    </ToggleButton>
                                                ))}
                                        </ButtonGroup>
                                    </FormGroup>
                                    <FormGroup label="Text" error={touched.Text && (errors.Text ?? state.errors.Text)}>
                                        <Field as="textarea" name="Text" placeholder="Text" className="form-control" rows={4} />
                                    </FormGroup>
                                    {/* Files */}
                                    <Button variant="primary" size="sm" className="me-3" onClick={() => fileRef.current?.click()}>
                                        <i className="bi bi-paperclip me-2"></i>
                                        Attach Files
                                    </Button>
                                    <input type="file" ref={fileRef} multiple style={{ display: "none" }} onChange={() => handleFileAttach(values)} />
                                    {values.Files?.map((file) => (
                                        <span key={"task-file" + file.Id + file.FileName} className="me-2">
                                            {file.IsDeleted ? (
                                                <span className="text-muted text-decoration-line-through">
                                                    <img src={getFileIcon(file.FileName)} alt="file icon" className="file-icon-attach" />
                                                    <span>{file.FileName}</span>
                                                </span>
                                            ) : (
                                                <Link
                                                    to={`api/file/${file.CompanyId}/${file.Id}/${file.FileName}`}
                                                    target="_blank"
                                                    title={file.FileName}>
                                                    <img src={getFileIcon(file.FileName)} alt="file icon" className="file-icon-attach" />
                                                    <span>{file.FileName}</span>
                                                </Link>
                                            )}
                                            <Link
                                                to="#"
                                                onClick={(event) => {
                                                    handleFileDelete(file);
                                                    event.stopPropagation();
                                                }}>
                                                <i className="bi bi-x fs-5 text-danger pointer"></i>
                                            </Link>
                                        </span>
                                    ))}
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
