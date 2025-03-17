import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Spinner, ToggleButton } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";
import overviewService from "../services/overview.service";
import authService from "../services/auth.service";
import { useEffect, useState } from "react";
import IJwt from "../types/jwt.type";
import OverviewTask from "./Overview.Task";
import TaskModal from "./Task.Modal";
import { useConfirm } from "./shared/confirm";
import TaskModel from "../services/models/task.model";
import taskService from "../services/task.service";
import { deletedTaskAction, deletingTaskAction } from "../states/task.state";
import { TaskColumnEnum } from "../enums/task.column.enum";
import { getTaskStatusDescription, TaskStatusEnum } from "../enums/task.status.enum";
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
    const [filterTextTrigger, setFilterTextTrigger] = useState<string>("filterText");
    const [filterKind, setFilterKind] = useState<TaskKindEnum | null>(null);
    const [filterStatus, setFilterStatus] = useState<TaskStatusEnum | null>(null);
    const [filterProjectId, setFilterProjectId] = useState<number | null>(null);
    const [filterDate, setFilterDate] = useState<string | "">("");
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch, filterTextTrigger, filterKind, filterStatus, filterProjectId, filterDate]);

    const load = async () => {
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);

        let service: overviewService = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.get(filterText, filterKind, filterStatus, filterProjectId, filterDate);
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
                        {/* responsive toolbar margins */}
                        {/* Card.Body class="pt-2 pb-0" */}
                        {/* Card.Body -> Col class="mb-2" */}
                        <Card.Body className="pt-2 pb-0">
                            <Row className="align-items-center">
                                <Col xs="auto" className="mb-2">
                                    <ButtonGroup>
                                        <Button onClick={handleAdd}>Task</Button>
                                        {/* <Button onClick={handleAdd}>Note</Button> */}
                                    </ButtonGroup>
                                </Col>
                                <Col xs="auto" className="mb-2">
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Search"
                                            style={{ width: "160px" }}
                                            value={filterText}
                                            onChange={(e) => {
                                                setFilterText(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setFilterTextTrigger(filterText);
                                                }
                                            }}
                                        />
                                        <Button variant="outline-secondary" className="btn-icon" onClick={() => setFilterTextTrigger(filterText)}>
                                            <i className="bi bi-search"></i>
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col xs="auto" className="mb-2">
                                    <ButtonGroup>
                                        {(Object.values(TaskKindEnum) as TaskKindEnum[])
                                            .filter((k) => Number(k))
                                            .map((kind) => (
                                                <ToggleButton
                                                    key={"filter-kind" + kind}
                                                    id={"filter-kind" + kind}
                                                    type="radio"
                                                    variant={filterKind == kind ? getTaskKindVariant(filterKind) : "outline-secondary"}
                                                    name="radio"
                                                    value={kind}
                                                    checked={filterKind == kind}
                                                    onClick={(e) => (filterKind == kind ? setFilterKind(null) : setFilterKind(kind))}>
                                                    {getTaskKindDescription(kind)}
                                                </ToggleButton>
                                            ))}
                                    </ButtonGroup>
                                </Col>
                                <Col xs="auto" className="mb-2">
                                    <Form.Select
                                        className={!filterStatus ? "text-muted" : ""}
                                        value={filterStatus || ""}
                                        onChange={(e) => setFilterStatus(parseInt(e.target.value) as TaskStatusEnum)}>
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
                                <Col xs="auto" className="mb-2">
                                    <Form.Select
                                        className={!filterProjectId ? "text-muted" : ""}
                                        value={filterProjectId || ""}
                                        onChange={(e) => setFilterProjectId(parseInt(e.target.value))}>
                                        <option value="">Filter Project</option>
                                        {projects?.map((project) => (
                                            <option key={"filter-project" + project.Id} value={project.Id}>
                                                {project.Name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col xs="auto" className="mb-2">
                                    <Form.Control
                                        className={!filterDate ? "text-muted" : ""}
                                        type="Date"
                                        value={filterDate}
                                        onChange={async (e) => {
                                            setFilterDate(e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col xs="auto" className="mb-2">
                                    <Button
                                        variant={filterText || filterKind || filterStatus || filterProjectId || filterDate ? "danger" : "outline-secondary"}
                                        onClick={() => {
                                            setFilterDate("");
                                            setFilterText("");
                                            setFilterKind(null);
                                            setFilterStatus(null);
                                            setFilterProjectId(null);
                                            load();
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
