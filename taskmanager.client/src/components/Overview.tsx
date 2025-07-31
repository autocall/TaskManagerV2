import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Spinner, ToggleButton } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import { testHelper } from "../helpers/test.helper";
import {
    processedOverviewTaskAction,
    processingOverviewTaskAction,
    gettingOverviewAction,
    gotOverviewAction,
    reloadOverviewCategoriesAction,
} from "../states/overview.state";
import overviewService from "../services/overview.service";
import authService from "../services/auth.service";
import { useEffect, useRef, useState } from "react";
import IJwt from "../types/jwt.type";
import OverviewTask from "./Overview.Task";
import TaskModal from "./Task.Modal";
import { useConfirm } from "./shared/confirm";
import TaskModel from "../services/models/task.model";
import taskService from "../services/task.service";
import { TaskColumnEnum } from "../enums/task.column.enum";
import { getTaskStatusDescription, TaskStatusEnum } from "../enums/task.status.enum";
import { getOverviewTaskKinds, getTaskKindDescription, getTaskKindVariant, TaskKindEnum } from "../enums/task.kind.enum";
import ProjectModel from "../services/models/project.model";
import CommentModel from "../services/models/comment.model";
import CommentModal from "./Comment.Modal";
import commentService from "../services/comment.service";
import CategoryModel from "../services/models/category.model";
import OverviewStatistic, { OverviewStatisticRef } from "./Overview.Statistic";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);
    const [currentUser, setCurrentUser] = useState<IJwt | null>(null);
    const [modalTaskData, setModalTaskData] = useState<TaskModel | null>(null);
    const [modalCommentData, setModalCommentData] = useState<CommentModel | null>(null);
    const [projects, setProjects] = useState<ProjectModel[] | null>(null);
    const [filterText, setFilterText] = useState<string>("");
    const [filterTextTrigger, setFilterTextTrigger] = useState<string>("filterText");
    const [filterKind, setFilterKind] = useState<TaskKindEnum | null>(null);
    const [filterStatus, setFilterStatus] = useState<TaskStatusEnum | null>(null);
    const [filterProjectId, setFilterProjectId] = useState<number | null>(null);
    const [filterDate, setFilterDate] = useState<string>("");
    const [scrollPosition, setScrollPosition] = useState<number | null>(null); // [scroll:1: hides the container during scroll restory
    const { confirm, ConfirmDialog } = useConfirm();
    const statisticRef = useRef<OverviewStatisticRef>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch, filterTextTrigger, filterKind, filterStatus, filterProjectId, filterDate]);
    // [scroll:2]: restores the scroll position
    useEffect(() => {
        if  (!state.loading) {
            if (scrollRef.current && scrollPosition) {
                scrollRef.current.scrollTop = scrollPosition;
                setScrollPosition(null);
            }
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.loading]);

    const load = async () => {
        // [scroll:3]: saves the scroll position
        if (scrollRef.current && scrollRef.current.scrollTop > 0) {
            setScrollPosition(scrollRef.current.scrollTop);
        }
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);

        let service = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingOverviewAction());
        let response = await service.get(filterText, filterKind, filterStatus, filterProjectId, filterDate);
        setProjects(overviewService.projects);
        dispatch(gotOverviewAction(response));
    };
    const handleTaskAdd = () => {
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
        setModalTaskData(model);
    };
    const handleTaskEdit = (model: TaskModel) => setModalTaskData(model);
    const handleTaskDelete = async (model: TaskModel) => {
        if (await confirm("Delete Task", `Are you sure you want to delete the task '${model.Index}'?`)) {
            let service = new taskService(testHelper.getTestContainer(search));
            dispatch(processingOverviewTaskAction(model.Id));
            let response = await service.delete(model.Id);
            dispatch(processedOverviewTaskAction(model.Id, response));
            if (response.success) {
                let categories = deleteTaskById(model.Id);
                dispatch(reloadOverviewCategoriesAction(categories));
                statisticRef.current?.load();
            }
        }
    };
    const handleTaskUp = async (model: TaskModel) => {
        let service = new taskService(testHelper.getTestContainer(search));
        dispatch(processingOverviewTaskAction(model.Id));
        let response = await service.up(model.Id);
        dispatch(processedOverviewTaskAction(model.Id, response));
        if (response.success) {
            let categories = reorderTaskById(model.Id, response.data);
            dispatch(reloadOverviewCategoriesAction(categories));
        }
    };
    const handleTaskDown = async (model: TaskModel) => {
        let service = new taskService(testHelper.getTestContainer(search));
        dispatch(processingOverviewTaskAction(model.Id));
        let response = await service.down(model.Id);
        dispatch(processedOverviewTaskAction(model.Id, response));
        if (response.success) {
            let categories = reorderTaskById(model.Id, response.data);
            dispatch(reloadOverviewCategoriesAction(categories));
        }
    };

    const handleCommentAdd = (model: TaskModel) => {
        let comment = CommentModel.create(currentUser!.TimeZoneId, model);
        setModalCommentData(comment);
    };
    const handleCommentEdit = (model: CommentModel) => setModalCommentData(model);

    const handleCommentDelete = async (model: CommentModel) => {
        if (await confirm("Delete Comment", `Are you sure you want to delete the comment?`)) {
            let service = new commentService(testHelper.getTestContainer(search));
            dispatch(processingOverviewTaskAction(model.TaskId));
            let response = await service.delete(model.Id);
            dispatch(processedOverviewTaskAction(model.TaskId, response));
            if (response.success) {
                let categories = deleteCommentById(model.Id);
                dispatch(reloadOverviewCategoriesAction(categories));
                statisticRef.current?.load();
                // reload the task
            }
        }
    };

    /** gets regenerated categories */
    const deleteTaskById = (taskId: number): CategoryModel[] => {
        return state.categories.map((category) => {
            let taskIndex = category.Tasks.findIndex((task) => task.Id === taskId);
            if (taskIndex === -1) return category;
            let newTasks = [...category.Tasks.slice(0, taskIndex), ...category.Tasks.slice(taskIndex + 1)];
            return {
                ...category,
                Tasks: newTasks,
            };
        });
    };

    /** gets regenerated categories */
    const deleteCommentById = (commentId: number): CategoryModel[] => {
        return state.categories.map((category) => {
            let newTasks = category.Tasks.map((task) => {
                let commentIndex = task.Comments.findIndex((comment) => comment.Id === commentId);
                if (commentIndex === -1) return task;
                let newComments = [...task.Comments.slice(0, commentIndex), ...task.Comments.slice(commentIndex + 1)];
                return {
                    ...task,
                    Comments: newComments,
                    filteredComments: task.filteredComments,
                };
            });
            return {
                ...category,
                Tasks: newTasks,
            };
        });
    };

    /** gets regenerated categories */
    const reorderTaskById = (taskId: number, newOrder: number): CategoryModel[] => {
        return state.categories.map((category) => {
            let taskIndex = category.Tasks.findIndex((t) => t.Id === taskId);
            if (taskIndex === -1) return category;
            let updatedTasks = [...category.Tasks];
            updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
                Order: newOrder,
                filteredComments: updatedTasks[taskIndex].filteredComments,
            };
            updatedTasks.sort((a, b) => b.Order - a.Order);
            return {
                ...category,
                Tasks: updatedTasks,
            };
        });
    };

    const handleTaskClose = async (reload: boolean) => {
        setModalTaskData(null);
        if (reload) {
            await load();
            statisticRef.current?.load();
        }
    };

    const handleCommentClose = async (reload: boolean) => {
        setModalCommentData(null);
        if (reload) {
            await load();
            statisticRef.current?.load();
        }
    };

    return (
        <>
            {ConfirmDialog}
            <TaskModal modalData={modalTaskData} onClose={handleTaskClose} />
            <CommentModal modalData={modalCommentData} onClose={handleCommentClose} />
            <Col lg="auto" className="d-none d-lg-block" style={{ width: "280px" }}>
                <Calendar />
                <OverviewStatistic ref={statisticRef} />
            </Col>
            {/* Col(scroll-content) - moves toolbar to scroll-container */}
            {/* Col(main-section) + div(scroll-content) - fixes toolbar */}
            <Col
                ref={scrollRef}
                // [scroll:4]: sets visibility by scrollPosition
                style={{ visibility: !scrollPosition ? "visible" : "hidden" }}
                md={true}
                /*className="main-section"*/ className="scroll-content">
                {state.error && <Alert variant="danger">{state.error}</Alert>}
                {state.loading ? (
                    <Row style={{ textAlign: "center", marginTop: "1em" }}>
                        <Col colSpan={10}>
                            <Spinner animation="border" />
                        </Col>
                    </Row>
                ) : (
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
                                            <Button onClick={handleTaskAdd}>Task</Button>
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
                                            {getOverviewTaskKinds()
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
                                            variant={
                                                filterText || filterKind || filterStatus || filterProjectId || filterDate
                                                    ? "danger"
                                                    : "outline-secondary"
                                            }
                                            onClick={() => {
                                                setFilterDate("");
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
                            {currentUser &&
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
                                                            processing={state.processingTaskId == task.Id}
                                                            currentUser={currentUser}
                                                            handleTaskEdit={handleTaskEdit}
                                                            handleTaskDelete={handleTaskDelete}
                                                            handleTaskUp={handleTaskUp}
                                                            handleTaskDown={handleTaskDown}
                                                            handleCommentAdd={handleCommentAdd}
                                                            handleCommentEdit={handleCommentEdit}
                                                            handleCommentDelete={handleCommentDelete}
                                                        />
                                                    ))}
                                                </Col>
                                            ))}
                                        </Row>
                                    </Row>
                                ))}
                        </div>
                    </div>
                )}
            </Col>
        </>
    );
};
export default Overview;
