import {E_SendingStatus} from "../../../const/Events";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {DiaryModel} from "../../../models/DiaryModel";
import {atom} from "recoil";
import {KeyDiaryList} from "../../KeyRecoil";

export type T_DiaryListState = {
    isLoading: E_SendingStatus,
    items: DiaryModel[],
    diaryId?:string|undefined
    error?: Record<string, any>,
    query : {
        page: number,
        count : number,
        // page_item:number,
        limit: number,
        sort: string,
        order: string
        sortBy:string
    }
    oMeta?: PaginateMetaModel
}
export const initialState:T_DiaryListState = {
    isLoading: E_SendingStatus.idle,
    items: [],
    query:{
        page:1,
        limit:10,
        count:1,
        // page_item:10,
        sortBy:"created_at",
        sort: "desc",
        order: "desc"
    }
}
export const DiaryListState  = atom<T_DiaryListState>({
    key:KeyDiaryList,
    default:initialState
})
export type T_DiaryIdState = {
    isLoading: E_SendingStatus,
    diaryId?:string
    error?: Record<string, any>
}
export const initialDiaryIdState: T_DiaryIdState = {
    isLoading: E_SendingStatus.idle
}