export enum TaskKindEnum {
    Task = 1,
    Fix = 2,
    Bug = 3,
    Feature = 4,
    Improvement = 5,
    Support = 6,
}

const TaskKindDescriptions: Record<TaskKindEnum, string> = {
    [TaskKindEnum.Task]: "Task",
    [TaskKindEnum.Fix]: "Fix",
    [TaskKindEnum.Bug]: "Bug",
    [TaskKindEnum.Feature]: "Feature",
    [TaskKindEnum.Improvement]: "Improvement",
    [TaskKindEnum.Support]: "Support",
};

const TaskKindVariants: Record<TaskKindEnum, string> = {
    [TaskKindEnum.Task]: "primary",
    [TaskKindEnum.Fix]: "warning",
    [TaskKindEnum.Bug]: "danger",
    [TaskKindEnum.Feature]: "primary",
    [TaskKindEnum.Improvement]: "success",
    [TaskKindEnum.Support]: "info",
};

const TaskKindColors: Record<TaskKindEnum, string> = {
    [TaskKindEnum.Task]: "RoyalBlue",
    [TaskKindEnum.Fix]: "DarkOrange",
    [TaskKindEnum.Bug]: "red",
    [TaskKindEnum.Feature]: "DodgerBlue",
    [TaskKindEnum.Improvement]: "ForestGreen",
    [TaskKindEnum.Support]: "LightSkyBlue",
};

export function getTaskKindDescription(kind: TaskKindEnum | null): string {
    return (kind && TaskKindDescriptions[kind]) || "Unknown";
}

export function getTaskKindVariant(kind: TaskKindEnum | null): string {
    return (kind && TaskKindVariants[kind]) || "secondary";
}

export function getTaskKindColor(kind: TaskKindEnum | null): string {
    return (kind && TaskKindColors[kind]) || "gray";
}

export function getOverviewTaskKinds(): TaskKindEnum[] {
    return [TaskKindEnum.Task, TaskKindEnum.Fix, TaskKindEnum.Bug, TaskKindEnum.Feature];
}
