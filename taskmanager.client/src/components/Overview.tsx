import { Alert, Button, ButtonGroup, Card, Col, Container, Dropdown, Form, InputGroup, ListGroup, Row, Spinner, ToggleButton } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";
import overviewService from "../services/overview.service";
import authService from "../services/auth.service";
import { useState } from "react";
import IJwt from "../types/jwt.type";
import OverviewTask from "./Overview.Task";
import TaskModal from "./Task.Modal";
import { useConfirm } from "./shared/confirm";
import TaskModel, { TaskData } from "../services/models/task.model";
import taskService from "../services/task.service";
import { deletedTaskAction, deletingTaskAction } from "../states/task.state";
import { TaskColumnEnum } from "../enums/task.column.enum";
import { getTaskStatusDescription, getTaskStatusVariant, TaskStatusEnum } from "../enums/task.status.enum";
import CategoryModel from "../services/models/category.model";
import { getTaskKindDescription, getTaskKindVariant, TaskKindEnum } from "../enums/task.kind.enum";
import ProjectModel from "../services/models/project.model";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);
    const [currentUser, setCurrentUser] = useState<IJwt | null>(null);
    const [modalData, setModalData] = useState<TaskModel | null>(null);
    const [projects, setProjects] = useState<ProjectModel[] | null>(null);
    const [filterText, setFilterText] = useState<string>("");
    const [filterKindId, setFilterKind] = useState<TaskKindEnum | null>(null);
    const [filterStatus, setFilterStatus] = useState<TaskStatusEnum | null>(null);
    const [filterProjectId, setFilterProjectId] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);

        let service: overviewService = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.get();
        setProjects(overviewService.projects);
        dispatch(gotCategoriesAction(response));
    };
    const handleAdd = () => {
        let model = new TaskModel();
        if (state.categories && state.categories.length > 0) {
            model.CategoryId = state.categories[0].Id;
        }
        model.Status = TaskStatusEnum.New;
        model.Column = TaskColumnEnum.First;
        let lastProjectId = localStorage.getItem("last-project-id");
        if (lastProjectId) {
            model.ProjectId = parseInt(lastProjectId);
        }
        setModalData(model);
    };
    const handleEdit = (model: TaskModel) => setModalData(model);
    const handleDelete = async (model: TaskModel) => {
        if (await confirm("Delete Task", `Are you sure you want to delete the task '${model.Index}'?`)) {
            let service: taskService = new taskService(testHelper.getTestContainer(search));
            dispatch(deletingTaskAction());
            let response = await service.delete(model.Id);
            dispatch(deletedTaskAction(response));
            if (response.success) {
                await load();
            }
        }
    };

    const handleClose = async (reload: boolean) => {
        setModalData(null);
        if (reload) {
            await load();
        }
    };

    return (
        <>
            {ConfirmDialog}
            <TaskModal modalData={modalData} onClose={handleClose} />
            <Col lg="auto" className="d-none d-lg-block" style={{ width: "280px" }}>
                <Calendar />
            </Col>
            {/* Col(scroll-content) - moves toolbar to scroll-container */}
            {/* Col(main-section) + div(scroll-content) - fixes toolbar */}
            <Col md={true} /*className="main-section"*/ className="scroll-content">
                <div className="main-section">
                    {/* toolbar */}
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col xs="auto">
                                <ButtonGroup>
                                    <Button onClick={handleAdd}>Task</Button>
                                    {/* <Button onClick={handleAdd}>Note</Button> */}
                                </ButtonGroup>
                                </Col>
                                <Col xs="auto">
                                    <InputGroup>
                                        <Form.Control placeholder="Search" value={filterText}     onChange={(e) => setFilterText(e.target.value)} />
                                        <Button variant="outline-secondary">
                                            <i className="bi bi-search"></i>
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col xs="auto">
                                    <ButtonGroup>
                                        {(Object.values(TaskKindEnum) as TaskKindEnum[])
                                            .filter((k) => Number(k))
                                            .map((kind) => (
                                                <ToggleButton
                                                    key={"task-kind" + kind}
                                                    id={"task-kind" + kind}
                                                    type="radio"
                                                    variant={filterKindId == kind ? getTaskKindVariant(filterKindId) : "outline-secondary"}
                                                    name="radio"
                                                    value={kind}
                                                    checked={filterKindId == kind}
                                                    onClick={(e) => (filterKindId == kind ? setFilterKind(null) : setFilterKind(kind))}>
                                                    {getTaskKindDescription(kind)}
                                                </ToggleButton>
                                            ))}
                                    </ButtonGroup>
                                </Col>
                                <Col xs="auto">
                                    <Form.Select value={filterStatus || ""}
                                        onChange={(e) => {
                                            setFilterStatus(parseInt(e.target.value) as TaskStatusEnum);
                                        }}>
                                        <option value="">Filter Status</option>
                                        {(Object.values(TaskStatusEnum) as TaskStatusEnum[])
                                            .filter((k) => Number(k))
                                            .map((status) => (
                                                <option key={"filter-status" + status} value={status}>
                                                    {getTaskStatusDescription(status)}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col xs="auto">
                                    <Form.Select value={filterProjectId || ""}
                                        onChange={(e) => {
                                            setFilterProjectId(parseInt(e.target.value));
                                        }}>
                                        <option value="">Filter Project</option>
                                        {projects?.map((project) => (
                                            <option key={"filter-project" + project.Id} value={project.Id}>
                                                {project.Name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant={filterKindId || filterStatus || filterProjectId ? "danger" : "outline-secondary"}
                                        onClick={() => {
                                            setFilterText("");
                                            setFilterKind(null);
                                            setFilterStatus(null);
                                            setFilterProjectId(null);
                                        }}>
                                        Reset
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {/* categories + tasks */}
                    <div /* className="scroll-content" */>
                        {state.error && <Alert variant="danger">{state.error}</Alert>}
                        {state.loading ? (
                            <Row style={{ textAlign: "center", marginTop: "1em" }}>
                                <Col colSpan={10}>
                                    <Spinner animation="border" />
                                </Col>
                            </Row>
                        ) : (
                            state.categories?.map((category) => (
                                <Row key={"category" + category.Id}>
                                    <Divider model={category} />
                                    <Row className="column-row">
                                        {[1, 2, 3].map((column) => (
                                            <Col key={category.Id + column} md={true}>
                                                {category.Tasks?.filter((task) => task.Column == column)?.map((task) => (
                                                    <OverviewTask
                                                        key={"task" + task.Id}
                                                        task={task}
                                                        currentUser={currentUser}
                                                        handleEdit={handleEdit}
                                                        handleDelete={handleDelete}
                                                    />
                                                ))}
                                            </Col>
                                        ))}
                                    </Row>
                                </Row>
                            ))
                        )}
                    </div>
                </div>
            </Col>
        </>
    );
};
export default Overview;
