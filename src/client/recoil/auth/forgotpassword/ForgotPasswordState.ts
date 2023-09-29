import {E_SendingStatus} from "../../../const/Events";

export type T_ForgotPasswordState = {
    error?: Record<string, any>;
    isLoading: E_SendingStatus;
};

export const initialState: T_ForgotPasswordState = {
    isLoading: E_SendingStatus.idle
};
