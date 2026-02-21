import { apiRequest } from "../../../http.js"

export function createSettingsApi(baseUrl: string, token: string, serverUuid: string) {
    return {
        /** Rename the server. Requires `settings.rename` permission. */
        rename(name: string): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/settings/rename`,
                data: { name },
            })
        },

        /** Update the server description. Requires `settings.description` permission. */
        updateDescription(description: string | null): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/settings/description`,
                data: { description },
            })
        },

        /** Reinstall the server (re-runs the install script). Requires `settings.reinstall` permission. */
        reinstall(): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/settings/reinstall`,
            })
        },

        /** Change the Docker image. Requires `startup.docker-image` permission. */
        setDockerImage(dockerImage: string): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'PUT',
                url: `/api/client/servers/${serverUuid}/settings/docker-image`,
                data: { docker_image: dockerImage },
            })
        },
    }
}
