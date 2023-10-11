import {E_SendingStatus} from "../../../const/Events";
import {ActivityLogModel} from "../../../models/UserModel";
import {KeyActivityLog} from "../../KeyRecoil";
import {atom} from "recoil";
import {PaginateMetaModel} from "../../../models/ApiResModel";

export type T_ActivityLogState = {
    isLoading: E_SendingStatus,
    items: ActivityLogModel[],
    item?:ActivityLogModel
    error?: Record<string, any>,
    query : {
        page: number,
        count : number,
        page_item:number,
        limit: number,
        sort: string,
        order: string
    }
    oMeta?: PaginateMetaModel
}
export const initialState: T_ActivityLogState = {
    isLoading: E_SendingStatus.idle,
    items: [],
    query:{
        page:1,
        limit:10,
        count:1,
        page_item:10,
        sort: "date",
        order: "desc"
    }
}
export const ActivityLogState  = atom<T_ActivityLogState>({
    key:KeyActivityLog,
    default:initialState
})