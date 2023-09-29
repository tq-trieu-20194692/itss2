import {UserModel} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";

export type T_ResetPasswordOTPState = {
    user?: UserModel
    status: E_SendingStatus
    error?: Record<string, any>
}

export const initialState: T_ResetPasswordOTPState = {
    status: E_SendingStatus.idle
}
