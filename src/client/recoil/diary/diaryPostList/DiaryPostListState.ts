import {E_SendingStatus} from "../../../const/Events";
import {PostDiaryModel} from "../../../models/DiaryModel";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {atom} from "recoil";
import {KeyDiaryListPost} from "../../KeyRecoil";

export type T_DiaryListPostState = {
    isLoading: E_SendingStatus,
    items: PostDiaryModel[],
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
export const initialState:T_DiaryListPostState = {
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
export const DiaryListPostState  = atom<T_DiaryListPostState>({
    key:KeyDiaryListPost,
    default:initialState
})