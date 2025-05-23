import { Badge, Button, Card, ListGroup, Spinner } from "react-bootstrap";
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
import { useState } from "react";
import { getFileIcon } from "../helpers/file-icons";

interface OverviewTaskProps {
    task: TaskModel;
    currentUser: IJwt | null;
    processing: boolean;
    handleTaskEdit: (model: TaskModel) => void;
    handleTaskDelete: (model: TaskModel) => void;
    handleTaskUp: (model: TaskModel) => void;
    handleTaskDown: (model: TaskModel) => void;
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
    handleTaskUp,
    handleTaskDown,
    handleCommentAdd,
    handleCommentEdit,
    handleCommentDelete,
}: OverviewTaskProps) => {
    const [showAllComments, setShowAllComments] = useState(false);

    const flex: string = "d-flex justify-content-between align-items-start";

    return (
        <Card key={"task" + task.Id} className="column-card" border={getTaskKindVariant(task.Kind)} style={{ position: "relative" }}>
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
                                title={file.FileName}>
                                <img src={getFileIcon(file.FileName)} alt="file icon" className="file-icon" />
                            </Link>
                        ))}
                        <span className="extra-text" style={{ wordBreak: "normal" }} title="Created Date">
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
                        <Link to="#" onClick={() => handleTaskUp(task)}>
                            &uarr;
                        </Link>{" "}
                        <Link to="#" onClick={() => handleTaskDown(task)}>
                            &darr;
                        </Link>
                        {" | "}
                        <Link to="#" onClick={() => handleCommentAdd(task)}>
                            Comment
                        </Link>
                        {" | "}
                        <Link to="#" onClick={() => handleTaskEdit(task)}>
                            Edit
                        </Link>
                        {" | "}
                        <Link to="#" onClick={() => handleTaskDelete(task)}>
                            Delete
                        </Link>
                    </div>
                </div>
            </Card.Body>
            {/* Comments */}
            {task.Comments?.length > 0 && (
                <ListGroup className="list-group-flush mx-2">
                    {task.Comments.length > task.filteredComments(false).length && (
                        <ListGroup.Item className="text-center pt-0">
                            <Link to="#" className="badge-text" onClick={() => setShowAllComments(!showAllComments)}>
                                {showAllComments ? "Hide comments" : `Show comments (${task.Comments.length - task.filteredComments(false).length})`}
                            </Link>
                        </ListGroup.Item>
                    )}
                    {task.filteredComments(showAllComments).map((comment) => (
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
                <div className="loading-overlay">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
        </Card>
    );
};
export default OverviewTask;
