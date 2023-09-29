import {E_SendingStatus} from "../../../const/Events";

export type T_ForgotPasswordOTPState = {
    error?: Record<string, any>;
    isLoading: E_SendingStatus;
};

export const initialState: T_ForgotPasswordOTPState = {
    isLoading: E_SendingStatus.idle
};
