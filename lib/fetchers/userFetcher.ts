import isEmail from "@/lib/isEmail";
import notify from "../toasts/notify";

export default async function userFetcher(method: HTTP, data: User | NewInfo, patchData?: User) {
    // Check for email validity
    if (!isEmail(data.email)) {
        return notify("Please enter a valid email", 'warn')
    }

    // For PATCH
    // Check to have at least one parameter to change
    if ((patchData?.email || patchData?.password || patchData?.username) && method === 'PATCH') {
        // Check for email validity if existent
        if (patchData.email && !isEmail(patchData.email)) {
            return notify("Please enter a valid email if updating the current one", 'warn')
        }

        data = {
            ...data,
            newEmail: patchData.email,
            newUsername: patchData.username,
            newPassword: patchData.password,
        }
    }

    try {
        const res = await fetch('api/user', {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!res.ok) {
            return notify(await res.text(), 'error')
        }

        return notify("Task complete", 'success')

    } catch (error) {
        const err = error as Error
        return notify(err.message, 'error')
    }
}