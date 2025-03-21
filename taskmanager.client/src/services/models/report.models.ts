import CommentModel from "./comment.model";
import ProjectModel from "./project.model";
import TaskModel from "./task.model";

export class ReportModel {
    WorkHours: number;
    public Projects: ReportProjectModel[];

    constructor(data: any) {
        this.WorkHours = data.WorkHours;
        this.Projects = data.Projects.map((p: any) => new ReportProjectModel(p));
    }
}

export class ReportProjectModel extends ProjectModel {
    WorkHours: number;
    public Tasks: ReportTaskModel[];

    constructor(data: any) {
        super(data);
        this.WorkHours = data.WorkHours;
        this.Tasks = data.Tasks.map((t: any) => new ReportTaskModel(t));
    }
}

export class ReportTaskModel extends TaskModel {
    public Comments: ReportCommentModel[];

    constructor(data: any) {
        super(data);
        this.Comments = data.Comments.map((c: any) => new ReportCommentModel(c));
    }
}

export class ReportCommentModel extends CommentModel {
    constructor(data: any) {
        super(data);
    }
}
