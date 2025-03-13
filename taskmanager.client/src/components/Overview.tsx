import { Alert, Badge, Button, Card, Col, Collapse, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";
import stringExtension from "../extensions/string.extension";
import overviewService from "../services/overview.service";
import { getTaskStatusDescription, getTaskStatusVariant } from "../enums/task.status.enum";
import { getTaskKindDescription, getTaskKindVariant } from "../enums/task.kind.enum";
import authService from "../services/auth.service";
import { useState } from "react";
import IJwt from "../types/jwt.type";
import SeeMoreText from "./shared/seemore.text";
import fileExtension from "../extensions/file.extension";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);
    const [currentUser, setCurrentUser] = useState<IJwt | null>(null);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);

        let service: overviewService = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.get();
        dispatch(gotCategoriesAction(response));
    };

    const flex: string = "d-flex justify-content-between align-items-start ";

    return (
        <Container fluid>
            <Row>
                <Col lg="auto" className="d-none d-lg-block" style={{ width: "300px" }}>
                    <Calendar />
                </Col>
                <Col md={true}>
                    {state.error && <Alert variant="danger">{state.error}</Alert>}
                    {state.loading ? (
                        <Row style={{ textAlign: "center" }}>
                            <Col colSpan={10}>
                                <Spinner animation="border" />
                            </Col>
                        </Row>
                    ) : (
                        state.categories?.map((category) => (
                            <Row key={category.Id}>
                                <Divider model={category} />
                                <Row className="column-row">
                                    {Array.from({ length: 3 }, (_, column) => (
                                        <Col key={category.Id + column} md={true}>
                                            {category.Tasks.filter((task) => task.Column == column + 1)?.map((task) => (
                                                <Card key={"task" + task.Id} className="column-card" border={getTaskKindVariant(task.Kind)}>
                                                    {/* Header */}
                                                    <Card.Header className={flex + getTaskKindVariant(task.Kind)}>
                                                        <div>
                                                            <span className="extra-text">
                                                                {getTaskKindDescription(task.Kind)} #{task.Index}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>{task.Project && task.Project.Name}</span>
                                                        </div>
                                                        <div>
                                                            <Badge pill bg={getTaskStatusVariant(task.Status)}>
                                                                {task.Title && getTaskStatusDescription(task.Status)}
                                                            </Badge>
                                                            {task.WorkHours > 0 && (
                                                                <Badge pill bg="primary" className="ms-1">
                                                                    {task.WorkHours}h
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </Card.Header>
                                                    {/* Body */}
                                                    <Card.Body>
                                                        {task.Title && <div className={flex}>{<span className="task-title">{task.Title}</span>}</div>}
                                                        {task.Description && (
                                                            <Card.Subtitle>
                                                                <SeeMoreText text={task.Description} />
                                                            </Card.Subtitle>
                                                        )}
                                                        <div className={flex}>
                                                            <div>
                                                                {task.Files?.map((file) => (
                                                                    <Link key={"file" + file.Id + file.FileName}
                                                                        className={`file bi ${fileExtension.getFileIcon(file.FileName)}`}
                                                                        title={file.FileName}
                                                                    />
                                                                ))}
                                                                <span className="extra-text" style={{ verticalAlign: "bottom" }}>
                                                                    {stringExtension.dateToLong(task.CreatedDateTime)}
                                                                </span>
                                                            </div>
                                                            {task.CommentsCount ? (
                                                                <div className="extra-text">
                                                                    <i className="bi bi-chat-dots me-1"></i>
                                                                    <span>{task.CommentsCount}</span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <div className="extra-link">
                                                                <Link>Comment</Link> | <Link>Edit</Link> | <Link>Delete</Link>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                    {/* Comments */}
                                                    {task.Comments?.length > 0 && (
                                                        <ListGroup className="list-group-flush mx-2">
                                                            {task.Comments.map((comment) => (
                                                                <ListGroup.Item key={"comment" + comment.Id} className="px-0">
                                                                    <div className={flex}>
                                                                        <span className="text-muted">
                                                                            {comment.CreatedUser && comment.CreatedById != currentUser?.UserId && (
                                                                                <span>{comment.CreatedUser.UserName} ● </span>
                                                                            )}
                                                                            {stringExtension.dateToFromNowShort(comment.DateTime)}
                                                                        </span>
                                                                        <div>
                                                                            <Badge pill bg="primary" className="ms-1">
                                                                                {comment.WorkHours}h
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <SeeMoreText text={comment.Text} />
                                                                    </div>
                                                                    <div className={flex}>
                                                                        <div>
                                                                            {comment.Files?.map((file) => (
                                                                                <Link key={"file" + file.Id + file.FileName}
                                                                                    className={`file bi ${fileExtension.getFileIcon(file.FileName)}`}
                                                                                    title={file.FileName}
                                                                                />
                                                                            ))}
                                                                            <span className="extra-text">
                                                                                {stringExtension.dateToLong(comment.DateTime)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="extra-link">
                                                                            <Link>Edit</Link> | <Link>Delete</Link>
                                                                        </div>
                                                                    </div>
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    )}
                                                </Card>
                                            ))}
                                        </Col>
                                    ))}
                                </Row>
                            </Row>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
};
export default Overview;
