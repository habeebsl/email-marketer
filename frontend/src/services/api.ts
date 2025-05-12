import axios from "axios"
import type { TemplateCreate } from "../interfaces"

const VITE_API_BASE = import.meta.env.VITE_API_BASE

const apiClient = axios.create({
	baseURL: `${VITE_API_BASE}/api`,
	headers: {
		'Content-Type': 'application/json'
	}
})

export const apiService = {
    signup(name: string, email: string) {
        console.log(VITE_API_BASE)
        return apiClient.post("/users/create", { email: email, name: name })   
    },

    verifyUser(email: string) {
        return apiClient.get("/users/verify", {
            params: {
                email: email
            }
        })
    },

    getProjects(userID: string) {
        return apiClient.get("/projects", {
            params: {
                user_id: userID
            }
        })
    },

    getProject(userID: string, projectID: string) {
        return apiClient.get(`/projects/${projectID}`, {
            params: {
                user_id: userID
            }
        }) 
    },

    sendMails(projectID: string, replyTo: string) {
        return apiClient.post(`/projects/send/${projectID}`, {}, {
            params: {
                reply_to: replyTo
            }
        })
    },

    getTemplate(templateID: string, userID: string) {
        return apiClient.get(`/templates/${templateID}`, {
            params: {
                user_id: userID
            }
        })
    },

    generateTemplates(painPoint: string, offer: string, cta: string) {
        return apiClient.post("/templates/generate", {
            pain_point: painPoint,
            offer_summary: offer,
            cta_line: cta
        })
    },

    generateICPs(painPoint: string, offer: string) {
        return apiClient.post(`/projects/icps/generate`, {
            offer_summary: offer,
            pain_point: painPoint,
        })
    },

    createProject(userID: string, projectName: string, templates: TemplateCreate[]) {
        return apiClient.post("/projects/create", {
            project_name: projectName,
            templates: templates
        }, {
            params: {
                user_id: userID
            }
        })
    },

    addICPs(projectID: string, icps: string[]) {
        return apiClient.post("/projects/icps/create", {
            icps: icps
        }, {
            params: {
                project_id: projectID
            }
        })
    }
}
