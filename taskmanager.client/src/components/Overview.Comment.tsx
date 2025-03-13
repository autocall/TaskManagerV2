import { Badge, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import stringExtension from "../extensions/string.extension";
import SeeMoreText from "./shared/seemore.text";
import fileExtension from "../extensions/file.extension";
import CommentModel from "../services/models/comment.model";
import IJwt from "../types/jwt.type";

interface OverviewCommentProps {
    comment: CommentModel;
    currentUser: IJwt | null;
}

const OverviewComment: React.FC<OverviewCommentProps> = ({ comment, currentUser }: OverviewCommentProps) => {
    const flex: string = "d-flex justify-content-between align-items-start";

    return (
        <ListGroup.Item key={"comment" + comment.Id} className="px-0">
            <div className={flex}>
                <span className="text-muted">
                    {comment.CreatedUser && comment.CreatedById != currentUser?.UserId && <span>{comment.CreatedUser.UserName} ● </span>}
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
                        <Link
                            key={"file" + file.Id + file.FileName}
                            className={`file bi ${fileExtension.getFileIcon(file.FileName)}`}
                            title={file.FileName}
                        />
                    ))}
                    <span className="extra-text">{stringExtension.dateToLong(comment.DateTime)}</span>
                </div>
                <div className="extra-link">
                    <Link>Edit</Link> | <Link>Delete</Link>
                </div>
            </div>
        </ListGroup.Item>
    );
};
export default OverviewComment;
