import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useRecoilState, useRecoilValue} from "recoil";
import {DiaryListPostState, initialDeleteState, initialFormState, initialState, T_CommonState, T_FormState} from "./DiaryPostListState";
import {T_QueryVO} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {PostDiaryModel} from "../../../models/DiaryModel";
import {setErrorHandled} from "../../CmAction";
import {useState} from "react";

export const DiaryPostListAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(DiaryListPostState)
    const vm = useRecoilValue(DiaryListPostState)
    const [deleteState, setDeleteState] = useState<T_CommonState>(initialDeleteState)
    const [formState, setFormState] = useState<T_FormState>(initialFormState)

    const dispatchGetDiaryListPost = (idPost: string | undefined, query?: T_QueryVO) => {
        console.log(query)
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        const _query = {
            ...query,
        }
        apiService
            .getListDiaryPost(idPost, _query)
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
                        console.log(1234)
                        merge = {
                            ...merge,
                            items: r.items.map((item: Record<string, any>) => new PostDiaryModel(item))
                        }
                    } else {
                        console.log(12342222)
                        merge = {
                            ...merge,
                            items: []
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
    const dispatchDeleteDiaryPost = (diaryPostId: string, data: any) => {
        setDeleteState({
            ...deleteState,
            isLoading: E_SendingStatus.loading
        })
        apiService.deleteDiaryPost(diaryPostId, data)
            .then(
                r => {
                    if (r.success) {
                        setState({
                            ...state,
                            // isLoading: E_SendingStatus.success,
                            items: state.items.filter((item: PostDiaryModel) => item.postDiaryId !== diaryPostId)
                        })

                        setDeleteState({
                            ...deleteState,
                            isLoading: E_SendingStatus.success
                        })
                    } else {
                        setDeleteState({
                            ...deleteState,
                            isLoading: E_SendingStatus.error,
                            error: r.error
                        })

                    }
                }
            )
            .catch(err => setErrorHandled(state, setState, 'error', err))

    }
    const dispatchEditDiaryPost = (id: string | undefined, data: any) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        setFormState({
            ...formState,
            isLoading: E_SendingStatus.loading
        })
        apiService.editDiaryPost(id, data).then(
            r => {
                if (r.success) {
                    setState({
                        ...state,
                        items: state.items.map(item => {
                            if (item.postDiaryId === id) {
                                return item.copyFrom(r.data);
                            }
                            return item;
                        })
                    })
                    setFormState({
                        ...formState,
                        isLoading: E_SendingStatus.success
                    })
                } else {
                    setFormState({
                        ...formState,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                }
            }
        ).catch(err => setErrorHandled(state, setState, 'state', err))
    }
    const dispatchResetDiaryPostState = () => {
        setState(initialState)
    }
    return {
        vm,
        vmDelete: deleteState,
        vmForm:formState,
        dispatchGetDiaryListPost,
        dispatchDeleteDiaryPost,
        dispatchResetDiaryPostState,
        dispatchEditDiaryPost
    }
}