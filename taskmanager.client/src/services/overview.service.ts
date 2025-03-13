import { testContainer } from "../helpers/test.helper";
import taskRepository from "../repositories/task.rep";
import TaskModel from "./models/task.model";
import Response from "./models/response";
import CategoryModel from "./models/category.model";
import overviewRepository from "../repositories/overview.rep";
import ProjectModel from "./models/project.model";
import CommentModel from "./models/comment.model";
import UserModel from "./models/user.model";
import FileModel from "./models/file.model";

export default class overviewService {
    private rep: overviewRepository;

    constructor(test: testContainer | null) {
        this.rep = new overviewRepository(test);
    }

    public get(): Promise<Response<CategoryModel[]>> {
        return this.rep
            .get()
            .then((response) => {
                let categories = (response.data.categories as any[]).map((e: any) => new CategoryModel(e));
                let projects = (response.data.projects as any[]).map((e: any) => new ProjectModel(e));
                let tasks = (response.data.tasks as any[]).map((e: any) => new TaskModel(e));
                let comments = (response.data.comments as any[]).map((e: any) => new CommentModel(e));
                let users = (response.data.users as any[]).map((e: any) => new UserModel(e));
                let files = (response.data.files as any[]).map((e: any) => new FileModel(e));
                let models = this.merge(categories, projects, tasks, comments, users, files);
                return Response.success<CategoryModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<CategoryModel[]>(exception);
            });
    }

    private merge(
        categories: CategoryModel[],
        projects: ProjectModel[],
        tasks: TaskModel[],
        comments: CommentModel[],
        users: UserModel[],
        files: FileModel[]
    ): CategoryModel[] {
        comments.forEach((comment) => {
            comment.CreatedUser = users.find((u) => u.Id == comment.CreatedById) ?? null;
            comment.ModifiedUser = users.find((u) => u.Id == comment.ModifiedById) ?? null;
            comment.Files = files.filter((f) => f.Id == comment.Id);
        });
        tasks.forEach((task) => {
            task.Project = projects.find((p) => p.Id == task.ProjectId) ?? null;
            task.Comments = comments.filter((c) => c.TaskId == task.Id);
            task.CreatedUser = users.find((u) => u.Id == task.CreatedById) ?? null;
            task.ModifiedUser = users.find((u) => u.Id == task.ModifiedById) ?? null;
            task.Files = files.filter((f) => f.Id == task.Id);
        });
        categories.forEach((category) => {
            category.Tasks = tasks.filter((t) => t.CategoryId == category.Id);
        });
        return categories;
    }
}
