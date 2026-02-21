export type TaskAction = 'command' | 'power' | 'backup' | 'delete_files'

export interface ScheduleCron {
    day_of_week: string
    day_of_month: string
    month: string
    hour: string
    minute: string
}

export interface ScheduleTask {
    id: number
    sequence_id: number
    action: TaskAction
    payload: string
    time_offset: number
    is_queued: boolean
    continue_on_failure: boolean
    created_at: string
    updated_at: string
}

export interface Schedule {
    id: number
    name: string
    cron: ScheduleCron
    is_active: boolean
    is_processing: boolean
    only_when_online: boolean
    last_run_at: string | null
    next_run_at: string | null
    created_at: string
    updated_at: string
    relationships?: {
        tasks: {
            object: 'list'
            data: Array<{ object: string; attributes: ScheduleTask }>
        }
    }
}

export interface CreateScheduleParams {
    name: string
    is_active?: boolean
    only_when_online?: boolean
    minute: string
    hour: string
    day_of_month: string
    month: string
    day_of_week: string
}

export interface UpdateScheduleParams {
    name?: string
    is_active?: boolean
    only_when_online?: boolean
    minute?: string
    hour?: string
    day_of_month?: string
    month?: string
    day_of_week?: string
}

export interface CreateTaskParams {
    action: TaskAction
    payload: string
    time_offset?: number
    continue_on_failure?: boolean
}

export interface UpdateTaskParams {
    action?: TaskAction
    payload?: string
    time_offset?: number
    continue_on_failure?: boolean
}
