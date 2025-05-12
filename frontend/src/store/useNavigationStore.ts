import { create } from 'zustand'

type NavigationState = {
  previousPage: string
  setPreviousPage: (page: string) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  previousPage: '',
  setPreviousPage: (page) => set({ previousPage: page }),
}))