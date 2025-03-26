import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import stringExtension from "../extensions/string.extension";
import { getTaskStatusDescription, getTaskStatusVariant } from "../enums/task.status.enum";
import { getTaskKindDescription, getTaskKindVariant } from "../enums/task.kind.enum";
import IJwt from "../types/jwt.type";
import SeeMoreText from "./shared/seemore-text";
import fileExtension from "../extensions/file.extension";
import TaskModel from "../services/models/task.model";
import OverviewComment from "./Overview.Comment";
import CommentModel from "../services/models/comment.model";

interface OverviewTaskProps {
    task: TaskModel;
    currentUser: IJwt | null;
    processing: boolean;
    handleTaskEdit: (model: TaskModel) => void;
    handleTaskDelete: (model: TaskModel) => void;
    handleCommentAdd: (model: TaskModel) => void;
    handleCommentEdit: (model: CommentModel) => void;
    handleCommentDelete: (model: CommentModel) => void;
}

const OverviewTask: React.FC<OverviewTaskProps> = ({
    task,
    currentUser,
    processing,
    handleTaskEdit,
    handleTaskDelete,
    handleCommentAdd,
    handleCommentEdit,
    handleCommentDelete,
}: OverviewTaskProps) => {
    const flex: string = "d-flex justify-content-between align-items-start";

    return (
        <Card key={"task" + task.Id} className="column-card" border={getTaskKindVariant(task.Kind)}>
            {/* Header */}
            <Card.Header className={flex + " " + getTaskKindVariant(task.Kind)}>
                <div className="extra-text">
                    {getTaskKindDescription(task.Kind)} #{task.Index}
                </div>
                <div>{task.Project && task.Project.Name}</div>
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
                            <Link
                                target="_blank"
                                to={`api/file/${file.CompanyId}/${file.Id}/${file.FileName}`}
                                key={"file" + file.Id + file.FileName}
                                className={`file bi ${fileExtension.getFileIcon(file.FileName)}`}
                                title={file.FileName}
                            />
                        ))}
                        <span className="extra-text" style={{ wordBreak: "normal" }}>
                            {stringExtension.dateToLong(task.CreatedDateTime, currentUser!.TimeZoneId)}
                        </span>
                    </div>
                    {task.CommentsCount ? (
                        <div className="extra-text">
                            <i className="bi bi-chat-dots me-1"></i>
                            <span>{task.CommentsCount}</span>
                        </div>
                    ) : null}
                    <div className="extra-link" style={{ whiteSpace: "normal", wordBreak: "normal" }}>
                        <Link to="#" onClick={() => handleCommentAdd(task)}>
                            Comment
                        </Link>{" "}
                        |{" "}
                        <Link to="#" onClick={() => handleTaskEdit(task)}>
                            Edit
                        </Link>{" "}
                        |{" "}
                        <Link to="#" onClick={() => handleTaskDelete(task)}>
                            Delete
                        </Link>
                    </div>
                </div>
            </Card.Body>
            {/* Comments */}
            {task.Comments?.length > 0 && (
                <ListGroup className="list-group-flush mx-2">
                    {task.Comments.map((comment) => (
                        <OverviewComment
                            key={"comment" + comment.Id}
                            comment={comment}
                            currentUser={currentUser}
                            handleEdit={handleCommentEdit}
                            handleDelete={handleCommentDelete}
                        />
                    ))}
                </ListGroup>
            )}
            {processing && (
                <div className="card-dimmer d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                </div>
            )}
        </Card>
    );
};
export default OverviewTask;
