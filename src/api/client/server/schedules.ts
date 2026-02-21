import { apiRequest } from '../../../http.js'
import type {
	CreateScheduleParams,
	CreateTaskParams,
	ListResponse,
	Schedule,
	ScheduleTask,
	SingleResponse,
	UpdateScheduleParams,
	UpdateTaskParams
} from '../../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
	return res.data.map(item => item.attributes)
}

export function createSchedulesApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List all schedules (each includes tasks). Requires `schedule.read` permission. */
		list() {
			return apiRequest<ListResponse<Schedule>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/schedules`
			}).then(unwrapList)
		},

		/** Get a single schedule with its tasks. */
		get(scheduleId: number) {
			return apiRequest<SingleResponse<Schedule>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}`
			}).then(unwrap)
		},

		/** Create a new schedule. Requires `schedule.create` permission. */
		create(params: CreateScheduleParams) {
			return apiRequest<SingleResponse<Schedule>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/schedules`,
				data: params
			}).then(unwrap)
		},

		/** Update an existing schedule. Requires `schedule.update` permission. */
		update(scheduleId: number, params: UpdateScheduleParams) {
			return apiRequest<SingleResponse<Schedule>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}`,
				data: params
			}).then(unwrap)
		},

		/** Delete a schedule and all its tasks. Requires `schedule.delete` permission. */
		delete(scheduleId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}`
			})
		},

		/** Execute a schedule immediately. Requires `schedule.update` permission. */
		execute(scheduleId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}/execute`
			})
		},

		/** Create a task within a schedule. Requires `schedule.update` permission. */
		createTask(scheduleId: number, params: CreateTaskParams) {
			return apiRequest<SingleResponse<ScheduleTask>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}/tasks`,
				data: params
			}).then(unwrap)
		},

		/** Update a task within a schedule. Requires `schedule.update` permission. */
		updateTask(scheduleId: number, taskId: number, params: UpdateTaskParams) {
			return apiRequest<SingleResponse<ScheduleTask>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}/tasks/${taskId}`,
				data: params
			}).then(unwrap)
		},

		/** Delete a task from a schedule. Requires `schedule.delete` permission. */
		deleteTask(scheduleId: number, taskId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/schedules/${scheduleId}/tasks/${taskId}`
			})
		}
	}
}
