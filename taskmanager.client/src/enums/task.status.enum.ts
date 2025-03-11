export enum TaskStatusEnum {
    New = 1,
    InProgress = 2,
    OnHold = 3,
    Completed = 4,
    Closed = 5,
    Canceled = 6,
}

const TaskStatusDescriptions: Record<TaskStatusEnum, string> = {
    [TaskStatusEnum.New]: "new",
    [TaskStatusEnum.InProgress]: "in progress",
    [TaskStatusEnum.OnHold]: "on hold",
    [TaskStatusEnum.Completed]: "completed",
    [TaskStatusEnum.Closed]: "closed",
    [TaskStatusEnum.Canceled]: "canceled",
};

const TaskStatusVariants: Record<TaskStatusEnum, string> = {
    [TaskStatusEnum.New]: "primary",
    [TaskStatusEnum.InProgress]: "success",
    [TaskStatusEnum.OnHold]: "warning",
    [TaskStatusEnum.Completed]: "danger",
    [TaskStatusEnum.Closed]: "secondary",
    [TaskStatusEnum.Canceled]: "secondary",
};

export function getTaskStatusDescription(status: TaskStatusEnum): string {
    return TaskStatusDescriptions[status] || "Unknown";
}

export function getTaskStatusVariant(status: TaskStatusEnum): string {
    return TaskStatusVariants[status] || "secondary";
}