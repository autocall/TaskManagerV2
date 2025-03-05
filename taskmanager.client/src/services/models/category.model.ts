import colorExtension from "../../extensions/color.extension";
import BaseModel from "./base.model";

export default class CategoryModel extends BaseModel {
    Name: string;
    Color: string;
    Order: number;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
            this.Color = colorExtension.toHex(data.Color);
            this.Order = data.Order;

            this.Color = localStorage.getItem("theme") === "light" ? colorExtension.toLightTheme(this.Color) : colorExtension.toDarkTheme(this.Color);
        }
    }
}
