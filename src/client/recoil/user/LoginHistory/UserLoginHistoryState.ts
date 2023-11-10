import {E_SendingStatus} from "../../../const/Events";
import {LoginHistoryModel} from "../../../models/UserModel";
import {KeyLoginHistory} from "../../KeyRecoil";
import {atom} from "recoil";

export type T_AccountLoginHistoryState = {
    isLoading: E_SendingStatus,
    items: LoginHistoryModel[],
    error?: Record<string, any>,
    item?: LoginHistoryModel

}

export const initialState: T_AccountLoginHistoryState = {
    isLoading: E_SendingStatus.idle,
    items: [],

}

export const UserLoginHistoryState  = atom<T_AccountLoginHistoryState>({
    key:KeyLoginHistory,
    default:initialState
})

export type T_CommonState = {
    isLoading: E_SendingStatus,
    error?: Record<string, any>
}


export const initialDetailState: T_CommonState = {
    isLoading: E_SendingStatus.idle
}

export const initialLogoutState: T_CommonState = {
    isLoading: E_SendingStatus.idle
}