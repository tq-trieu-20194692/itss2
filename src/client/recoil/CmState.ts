import {E_SendingStatus} from "../const/Events";

export type T_FormState = {
    isLoading: E_SendingStatus
    error?: Record<string, any>
}

export type T_DeleteState = {
    isLoading: E_SendingStatus
    error?: Record<string, any>
}

export const initialFormState: T_FormState = {
    isLoading: E_SendingStatus.idle
}

export const initialDeleteState: T_DeleteState = {
    isLoading: E_SendingStatus.idle
}