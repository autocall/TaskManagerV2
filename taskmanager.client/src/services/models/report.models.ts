import CommentModel from "./comment.model";
import ProjectModel from "./project.model";
import TaskModel from "./task.model";

export class ReportModel {
    WorkHours: number;
    public Projects: ReportProjectModel[];
    public KindHours: { [kind: number]: number };

    constructor(data: any) {
        this.WorkHours = data.WorkHours;
        this.Projects = data.Projects.map((p: any) => new ReportProjectModel(p));
        this.KindHours = {};
        for (let p of this.Projects) {
            for (let t of p.Tasks) {
                for (let c of t.Comments) {
                    if (!this.KindHours[t.Kind as number]) {
                        this.KindHours[t.Kind as number] = 0;
                    }
                    this.KindHours[t.Kind as number] += c.WorkHours;
                }
            }
        }
        console.log(this.KindHours);
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
