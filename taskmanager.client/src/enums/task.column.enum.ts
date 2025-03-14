export enum TaskColumnEnum {
    First = 1,
    Second = 2,
    Third = 3,
}

const TaskColumnDescriptions: Record<TaskColumnEnum, string> = {
    [TaskColumnEnum.First]: "First",
    [TaskColumnEnum.Second]: "Second",
    [TaskColumnEnum.Third]: "Third",
};

export function getTaskColumnDescription(column: TaskColumnEnum): string {
    return TaskColumnDescriptions[column] || "Unknown";
}
