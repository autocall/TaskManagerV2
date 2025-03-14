import colorExtension from "../../extensions/color.extension";
import BaseModel from "./base.model";
import TaskModel from "./task.model";

export default class CategoryModel extends BaseModel {
    Name: string;
    Color: string;
    ColorForeground: string;
    ColorBackground: string;
    Order: number;

    Tasks: TaskModel[];

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
            this.Color = colorExtension.toHex(data.Color);
            this.Order = data.Order;

            this.Tasks = data.Tasks?.map((t: any) => new TaskModel(t));

            this.ColorForeground =
                localStorage.getItem("theme") === "light" ? colorExtension.toLightTheme(this.Color) : colorExtension.toDarkTheme(this.Color);
            this.ColorBackground =
                localStorage.getItem("theme") !== "light" ? colorExtension.toLightTheme(this.Color) : colorExtension.toDarkTheme(this.Color);
        }
    }
}
