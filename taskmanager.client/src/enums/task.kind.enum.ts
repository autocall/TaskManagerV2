export enum TaskKindEnum {
    Task = 1,
    Bug = 2,
    Feature = 3,
    Support = 4,
}

const TaskKindDescriptions: Record<TaskKindEnum, string> = {
    [TaskKindEnum.Task]: "Task",
    [TaskKindEnum.Bug]: "Bug",
    [TaskKindEnum.Feature]: "Feature",
    [TaskKindEnum.Support]: "Support",
};

const TaskKindVariants: Record<TaskKindEnum, string> = {
    [TaskKindEnum.Task]: "primary",
    [TaskKindEnum.Bug]: "danger",
    [TaskKindEnum.Feature]: "success",
    [TaskKindEnum.Support]: "info",
};

export function getTaskKindDescription(kind: TaskKindEnum | null): string {
    return kind && TaskKindDescriptions[kind] || "Unknown";
}

export function getTaskKindVariant(kind: TaskKindEnum | null): string {
    return kind && TaskKindVariants[kind] || "secondary";
}