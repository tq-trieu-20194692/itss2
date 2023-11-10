import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useRecoilState, useRecoilValue} from "recoil";
import {DiaryListPostState} from "./DiaryPostListState";
import {T_QueryVO} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {PostDiaryModel} from "../../../models/DiaryModel";
import {setErrorHandled} from "../../CmAction";

export const DiaryPostListAction = () =>{
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(DiaryListPostState)
    const vm = useRecoilValue(DiaryListPostState)
    const dispatchGetDiaryListPost = (idPost:string|undefined, query?: T_QueryVO) => {
        console.log(query)
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        const _query = {
            ...query,
        }
        apiService
            .getListDiaryPost(idPost,_query)
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
                            items: r.items.map((item: Record<string, any>) => new PostDiaryModel(item))
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
    return {
        vm,
        dispatchGetDiaryListPost,
    }
}