import {UserModel} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";

export type T_RegisterState = {
    user?: UserModel
    status: E_SendingStatus
    error?: Record<string, any>
}

export const initialState: T_RegisterState = {
    status: E_SendingStatus.idle
}
