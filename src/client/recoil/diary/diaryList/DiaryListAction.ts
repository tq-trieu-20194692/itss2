import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useRecoilState, useRecoilValue} from "recoil";
import {DiaryListState,initialState} from "./DiaryListState";
import {T_QueryVO} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {setErrorHandled} from "../../CmAction";
import {DiaryModel} from "../../../models/DiaryModel";

export const DiaryListAction = ()=>{
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(DiaryListState)
    const vm = useRecoilValue(DiaryListState)
    const dispatchGetDiaryList = (query?: T_QueryVO) => {
        console.log(query)
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        const _query = {
            ...query,
        }
        apiService
            .getListDiary(_query)
            .then(r => {
                if (r.success) {
                    let merge = {...state}
                    const page = query?.page ?? 1
                    if (r.meta instanceof PaginateMetaModel) {
                        merge = {
                            ...merge,
                            oMeta: r.meta
                        }

                        const limit = r.meta.perPage

                        if (limit && limit !== merge.query.limit) {
                            merge.query = {
                                ...merge.query,
                                limit: limit
                            };
                        }

                    }

                    if (r.items) {
                        merge = {
                            ...merge,
                            items: r.items.map((item: Record<string, any>) => new DiaryModel(item))
                        }
                    }

                    if (page !== merge.query.page) {
                        merge.query = {
                            ...merge.query,
                            page: page
                        }
                    }

                    setState({
                        ...merge,
                        isLoading: E_SendingStatus.success
                    })

                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(err => setErrorHandled(state, setState, 'isLoading', err))
    }
    const dispatchResetDiaryState =() =>{
        setState(initialState)
    }
    const disPatchLoadID =(id:string|undefined) =>{
        if(id!==undefined)
        {
            setState({
                ...state,
                isLoading:E_SendingStatus.success,
                diaryId:id
            })

        }
    }
    return {
        vm,
        dispatchGetDiaryList,
        disPatchLoadID,
        dispatchResetDiaryState
    }
}