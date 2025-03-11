import { Alert, Badge, Card, Col, Collapse, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { useLocation } from "react-router-dom";
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
                                <Row>
                                    {Array.from({ length: 3 }, (_, column) => (
                                        <Col key={`${category.Id}-${column}`} md={true}>
                                            {category.Tasks.filter((task) => task.Column == column + 1)?.map((task) => (
                                                <Row key={task.Id}>
                                                    <Col>
                                                        <Card className="mb-2" border={getTaskKindVariant(task.Kind)}>
                                                            <Card.Header
                                                                className={
                                                                    "d-flex justify-content-between align-items-start " +
                                                                    getTaskKindVariant(task.Kind)
                                                                }>
                                                                <div>
                                                                    <span className="badge-text">
                                                                        {task.Title && getTaskKindDescription(task.Kind)} #{task.Index}
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
                                                            <Card.Body>
                                                                {task.Title && (
                                                                    <div className="d-flex justify-content-between align-items-start">
                                                                        {<span className="task-title">{task.Title}</span>}
                                                                        <span className="badge-text text-muted">
                                                                            {stringExtension.dateToFromNowShort(task.CreatedDateTime)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {task.Description && <Card.Subtitle>{task.Description}</Card.Subtitle>}
                                                            </Card.Body>
                                                            {/* Comments */}
                                                            {task.Comments?.length > 0 && (
                                                                <ListGroup className="list-group-flush mx-3">
                                                                    {task.Comments.map((comment) => (
                                                                        <ListGroup.Item key={comment.Id} className="px-0">
                                                                            <div className="d-flex justify-content-between align-items-start">
                                                                                <span className="text-muted">
                                                                                    {comment.CreatedUser &&
                                                                                        comment.CreatedById != currentUser?.UserId && (
                                                                                            <span>
                                                                                                {comment.CreatedUser.UserName}&nbsp;
                                                                                            </span>
                                                                                        )}
                                                                                    {stringExtension.dateToShort(comment.DateTime)},&nbsp;
                                                                                    <span className="badge-text">
                                                                                        {stringExtension.dateToFromNowShort(
                                                                                            comment.DateTime,
                                                                                        )}
                                                                                    </span>
                                                                                </span>
                                                                                <div>
                                                                                    <Badge pill bg={getTaskStatusVariant(comment.Status)}>
                                                                                        {getTaskStatusDescription(comment.Status)}
                                                                                    </Badge>
                                                                                    <Badge pill bg="primary" className="ms-1">
                                                                                        {comment.WorkHours}h
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <span> {comment.Text}</span>
                                                                            </div>
                                                                        </ListGroup.Item>
                                                                    ))}
                                                                </ListGroup>
                                                            )}
                                                        </Card>
                                                    </Col>
                                                </Row>
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
