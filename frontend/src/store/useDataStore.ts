import { create } from 'zustand'
import type { TemplateCreate } from '../interfaces'

interface Data {
    formData: {
        cta_line: string,
        offer_summary: string,
        pain_point: string,
    }
    setFormData: (painPoint: string, offer: string, cta_line: string) => void

    projectName: string
    setProjectName: (name: string) => void

    icps: string[]
    setIcps: (icps: string[]) => void

    templates: TemplateCreate[]
    setTemplates: (templates: TemplateCreate[]) => void

    currentStep: number
    setCurrentStep: (num: number) => void
}

export const useData = create<Data>((set) => ({
    formData: {
        cta_line: '',
        offer_summary: '',
        pain_point: ''
    },

    setFormData: (painPoint, offer, cta_line) => set({ formData: {
        cta_line: cta_line,
        offer_summary: offer,
        pain_point: painPoint 
    } }),

    projectName: '',
    setProjectName: (name: string) => set({ projectName: name }),

    icps: [""],
    setIcps: (icps: string[]) => set({ icps: icps }),

    templates: [{
        email_subject: "",
        email_template: ""
    }],

    setTemplates: (templates: TemplateCreate[]) => set({ templates: templates }),

    currentStep: 0,
    setCurrentStep: (num: number) => (set({ currentStep: num }))
}))