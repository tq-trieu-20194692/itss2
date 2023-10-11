import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useRecoilState, useRecoilValue} from "recoil";
import { initialDetailState, initialLogoutState, T_CommonState} from "./UserLoginHistoryState";
import {E_SendingStatus} from "../../../const/Events";
import {LoginHistoryModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {useState} from "react";
import {UserLoginHistoryState} from "./UserLoginHistoryState";

export const UserLoginHistoryAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useRecoilState(UserLoginHistoryState)
    const vm = useRecoilValue(UserLoginHistoryState)

    const [detailState] = useState<T_CommonState>(initialDetailState)
    const [logoutState, setLogoutState] = useState<T_CommonState>(initialLogoutState)
    const dispatchHistoryLogin = () => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService.getLoginHistory()
            .then(r => {
                if (r.success) {

                    setState({
                        ...state,
                        isLoading: E_SendingStatus.success,
                        items: r.items.map((item: Record<string, any>) => new LoginHistoryModel(item)),
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


    const dispatchFarLogout = (idSession: string) => {
        setLogoutState({
            ...logoutState,
            isLoading: E_SendingStatus.loading
        })
        apiService.postFarLogout(idSession)
            .then(
                r => {
                    if (r.success) {
                        setState({
                            ...state,
                            // isLoading: E_SendingStatus.success,
                            items: state.items.map(item => {
                                if (item.id===idSession) {
                                    return {...item,
                                        key:'admin.user.logout',
                                        anotherLogout:true
                                    }
                                }
                                return item;
                            })
                        })

                        setLogoutState({
                            ...logoutState,
                            isLoading: E_SendingStatus.success
                        })
                    } else {
                        setLogoutState({
                            ...logoutState,
                            isLoading: E_SendingStatus.error,
                            error: r.error
                        })

                    }
                }
            )
            .catch(err => setErrorHandled(state, setState, 'error', err))

    }
    return {
        vm,
        vmDetail: detailState,
        vmLogout: logoutState,
        dispatchHistoryLogin,
        dispatchFarLogout
    }
}