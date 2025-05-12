export interface SignupForm {
    fullname: string;
    email: string;
}

export interface Records {
    id: string
    total_sent: number
    successes: number
    failures: number
    subset_name: string
}

export interface Template {
    email_subject: string
    email_template: string
    id: string
    total_sent: number
    successes: number
    failures: number
    performance_records: Records[]
}

export interface TemplateCreate {
    email_subject: string
    email_template: string
} 

export interface Project {
    project_name: string
    id: string
    templates: Template[]
    icp_subsets: Array<{ id: string; name: string }>
    updated_at: string
}