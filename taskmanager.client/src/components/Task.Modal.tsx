import { Button, ButtonGroup, CloseButton, Modal, Spinner, ToggleButton } from "react-bootstrap";
import TaskModel, { TaskData } from "../services/models/task.model";
import { Formik, Field, FormikProps } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import FormGroup from "./shared/form-group";
import { AppState } from "../states/store";
import {
    createTaskAction,
    gettingTaskAction,
    gotTaskAction,
    submittingTaskAction,
    submittedTaskAction,
    closeTaskAction,
    TaskState,
} from "../states/task.state";
import useAsyncEffect from "use-async-effect";
import taskService from "../services/task.service";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { testHelper } from "../helpers/test.helper";
import { useConfirm } from "./shared/confirm";
import { useRef, useState } from "react";
import { getTaskColumnDescription, TaskColumnEnum } from "../enums/task.column.enum";
import { getTaskKindDescription, getTaskKindVariant, TaskKindEnum } from "../enums/task.kind.enum";
import CategoryModel from "../services/models/category.model";
import ProjectModel from "../services/models/project.model";
import overviewService from "../services/overview.service";
import { getTaskStatusDescription, getTaskStatusVariant, TaskStatusEnum } from "../enums/task.status.enum";
import FileModel from "../services/models/file.model";
import fileExtension from "../extensions/file.extension";
import { getFileIcon } from "../helpers/file-icons";

interface TaskModalProps {
    modalData: TaskModel | null;
    onClose: (reload: boolean) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ modalData, onClose }) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const formikRef = useRef<FormikProps<TaskState>>(null);
    const { search } = useLocation();
    const [categories, setCategories] = useState<CategoryModel[] | null>(null);
    const [projects, setProjects] = useState<ProjectModel[] | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();
    let dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.taskState);

    useAsyncEffect(async () => {
        setProjects(overviewService.projects);
        setCategories(overviewService.categories);

        if (modalData != null) {
            if (modalData.Id) {
                let service = new taskService(testHelper.getTestContainer(search));
                dispatch(gettingTaskAction());
                let response = await service.get(modalData.Id);
                dispatch(gotTaskAction(response));
            } else {
                // sets the default column by the project
                if (modalData.ProjectId) {
                    modalData.Column = overviewService.projects!.find((p) => p.Id === modalData.ProjectId)!.DefaultColumn;
                }
                dispatch(createTaskAction(modalData));
            }
        }
    }, [modalData, dispatch]);

    const validationSchema = Yup.object().shape({
        Column: Yup.number().required("Column is required"),
        Status: Yup.number().required("Status is required"),
        Title: Yup.string(),
        Description: Yup.string().test("at-least-one", "Either Title or Description is required", function () {
            const { Title, Description } = this.parent;
            return Boolean(Title?.trim() || Description?.trim());
        }),
    });

    const handleFileAttach = (model: TaskState) => {
        const files = fileRef.current?.files;
        model.Files?.push(...Array.from(files ?? []).map((f) => FileModel.createFromBlob(f)));
        formikRef.current?.setFieldValue("Files", model.Files);
    };

    const handleFileDelete = (file: FileModel) => {
        file.IsDeleted = !file.IsDeleted;
    };

    const handleProjectChanged = (e: any) => {
        const selectedProjectId = e.target.value;
        const selectedProject = projects?.find((p) => p.Id.toString() === selectedProjectId);
        formikRef.current?.setFieldValue("ProjectId", selectedProjectId);
        if (selectedProject) {
            formikRef.current?.setFieldValue("Column", selectedProject.DefaultColumn);
        }
    };

    const handleSubmit = async (model: TaskState) => {
        let service = new taskService(testHelper.getTestContainer(search));
        if (modalData?.Id) {
            dispatch(submittingTaskAction());
            let response = await service.update(modalData.Id, new TaskData(model));
            dispatch(submittedTaskAction(response));
            if (response.success) {
                handleClose(true);
            }
        } else {
            dispatch(submittingTaskAction());
            let response = await service.create(new TaskData(model));
            dispatch(submittedTaskAction(response));
            if (response.success) {
                localStorage.setItem("last-project-id", model.ProjectId?.toString() ?? "");
                handleClose(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!modalData?.Id) return;
        if (await confirm("Delete Task", `Are you sure you want to delete the task '#${modalData.Index}'?`)) {
            let service = new taskService(testHelper.getTestContainer(search));
            dispatch(submittingTaskAction());
            let response = await service.delete(modalData.Id);
            dispatch(submittedTaskAction(response));
            if (response.success) {
                handleClose(true);
            }
        }
    };

    const handleClose = (reload: boolean) => {
        dispatch(closeTaskAction());
        onClose(reload);
    };

    return (
        <Modal show={modalData != null} onHide={() => handleClose(false)} size="lg" backdrop="static">
            {ConfirmDialog}
            <Modal.Header closeButton>
                <Modal.Title>{modalData?.Id ? `Edit Task #${modalData.Index}` : "Add Task"}</Modal.Title>
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
                                    <FormGroup label="Title" error={touched.Title && (errors.Title ?? state.errors.Title)}>
                                        <Field name="Title" placeholder="Title" className="form-control" />
                                    </FormGroup>
                                    <FormGroup label="Project" error={touched.ProjectId && (errors.ProjectId ?? state.errors.ProjectId)}>
                                        <Field as="select" name="ProjectId" className="form-control" onChange={handleProjectChanged}>
                                            <option value="">Select Project</option>
                                            {projects?.map((project) => (
                                                <option key={"task-project" + project.Id} value={project.Id}>
                                                    {project.Name}
                                                </option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                    <FormGroup
                                        label="Column"
                                        className="d-grid gap-2"
                                        error={touched.Column && (errors.Column ?? state.errors.Column)}>
                                        <ButtonGroup>
                                            {(Object.values(TaskColumnEnum) as TaskColumnEnum[])
                                                .filter((k) => Number(k))
                                                .map((column) => (
                                                    <ToggleButton
                                                        key={"task-column" + column}
                                                        id={"task-column" + column}
                                                        type="radio"
                                                        variant={values.Column == column ? "primary" : "outline-secondary"}
                                                        name="radio"
                                                        value={column}
                                                        checked={values.Column == column}
                                                        onChange={(e) => setFieldValue("Column", column)}>
                                                        {getTaskColumnDescription(column)}
                                                    </ToggleButton>
                                                ))}
                                        </ButtonGroup>
                                    </FormGroup>
                                    <FormGroup label="Kind" error={touched.Kind && (errors.Kind ?? state.errors.Kind)}>
                                        <ButtonGroup>
                                            {(Object.values(TaskKindEnum) as TaskKindEnum[])
                                                .filter((k) => Number(k))
                                                .map((kind) => (
                                                    <ToggleButton
                                                        key={"task-kind" + kind}
                                                        id={"task-kind" + kind}
                                                        type="radio"
                                                        variant={values.Kind == kind ? getTaskKindVariant(values.Kind) : "outline-secondary"}
                                                        name="radio"
                                                        value={kind}
                                                        checked={values.Kind == kind}
                                                        onChange={(e) => setFieldValue("Kind", kind)}>
                                                        {getTaskKindDescription(kind)}
                                                    </ToggleButton>
                                                ))}
                                        </ButtonGroup>
                                    </FormGroup>
                                    <FormGroup label="Category" error={touched.CategoryId && (errors.CategoryId ?? state.errors.CategoryId)}>
                                        <ButtonGroup>
                                            {categories?.map((category) => (
                                                <ToggleButton
                                                    key={"task-category" + category.Id}
                                                    id={"task-category" + category.Id}
                                                    type="radio"
                                                    variant={values.CategoryId == category.Id ? "secondary" : "outline-secondary"}
                                                    style={{ background: values.CategoryId == category.Id ? category.ColorBackground : "inherit" }}
                                                    value={category.Id}
                                                    checked={values.CategoryId == category.Id}
                                                    onChange={(e) => setFieldValue("CategoryId", category.Id)}>
                                                    {category.Name}
                                                </ToggleButton>
                                            ))}
                                        </ButtonGroup>
                                    </FormGroup>
                                    <FormGroup label="Status" error={touched.Status && (errors.Status ?? state.errors.Status)}>
                                        <ButtonGroup>
                                            {(Object.values(TaskStatusEnum) as TaskStatusEnum[])
                                                .filter((k) => Number(k))
                                                .map((status) => (
                                                    <ToggleButton
                                                        key={"task-status" + status}
                                                        id={"task-status" + status}
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
                                    <FormGroup label="Description" error={touched.Description && (errors.Description ?? state.errors.Description)}>
                                        <Field as="textarea" name="Description" placeholder="Description" className="form-control" rows={3} />
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

export default TaskModal;
