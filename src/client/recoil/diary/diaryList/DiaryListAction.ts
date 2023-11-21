import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useRecoilState, useRecoilValue} from "recoil";
import {DiaryListState, initialDeleteState, initialFormState, initialState, T_CommonState, T_FormState} from "./DiaryListState";
import {T_QueryVO} from "../../../models/UserModel";
import {E_SendingStatus} from "../../../const/Events";
import {PaginateMetaModel} from "../../../models/ApiResModel";
import {setErrorHandled} from "../../CmAction";
import {DiaryModel} from "../../../models/DiaryModel";
import {useState} from "react";
import {T_FormAddDiary, T_FormEditDiary} from "../../../presentation/screens/homepage/DiaryWidget";

export const DiaryListAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(DiaryListState)
    const vm = useRecoilValue(DiaryListState)
    const [deleteState, setDeleteState] = useState<T_CommonState>(initialDeleteState)
    const [formState, setFormState] = useState<T_FormState>(initialFormState)

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
                    else {
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
    const dispatchResetDiaryState = () => {
        setState(initialState)
    }
    const dispatchDeleteDiary = (id: string | undefined,data:any) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        setDeleteState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService.deleteListDiary(id,data).then(
            r => {
                if (r.success) {
                    console.log(r)
                    setState({
                        ...state,
                        items: state.items.filter((item: DiaryModel) => item.diaryId!== id)
                    })
                    setDeleteState(
                        {
                            ...deleteState,
                            isLoading: E_SendingStatus.success
                        }
                    )
                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error
                    })
                    setDeleteState(
                        {
                            ...deleteState,
                            isLoading: E_SendingStatus.error,
                            error: r.error
                        }
                    )
                }
            }
        ).catch(err => setErrorHandled(state, setState, 'state', err))
    }
    const dispatchEditDiary = (id: string|undefined, data:T_FormEditDiary) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        setFormState({
            ...formState,
            isLoading: E_SendingStatus.loading
        })
        apiService.editListDiary(id, data).then(
            r => {
                if (r.success) {
                    setState({
                        ...state,
                        items: state.items.map(item => {
                            if (item.diaryId === id) {
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
    const dispatchAddDiary = (data:T_FormAddDiary)=>{
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        setFormState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService.addDiary(data).then(
            r => {
                if (r.success) {
                    console.log(r)
                    setState({
                        ...state,
                        items: [new DiaryModel(r.data), ...state.items]
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
            })
            .catch(e => {
                console.log(e)
            }
        )
    }
    const disPatchLoadID = (id: string | undefined) => {
        if (id !== undefined) {
            setState({
                ...state,
                isLoading: E_SendingStatus.success,
                diaryId: id
            })

        }
    }
    return {
        vm,
        vmDelete: deleteState,
        vmForm: formState,
        dispatchGetDiaryList,
        disPatchLoadID,
        dispatchResetDiaryState,
        dispatchDeleteDiary,
        dispatchEditDiary,
        dispatchAddDiary
    }
}