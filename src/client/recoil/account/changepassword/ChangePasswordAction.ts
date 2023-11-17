import {initialState, T_ChangePasswordState} from "./ChangePasswordState";
import {ApiService} from "../../../repositories/ApiService";
import {T_ChangePasswordVO ,UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {useInjection} from "inversify-react";
import {E_SendingStatus} from "../../../const/Events";
import {useState} from "react";

export const ChangePasswordAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useState<T_ChangePasswordState>(initialState)

    const dispatchResetPassword = (data: T_ChangePasswordVO) => {
        setState({
            ...state,
            status: E_SendingStatus.loading
        })

        apiService
            .changePassword(data)
            .then(r => {
                console.log(r)
                if (r.success) {
                    const user = new UserModel(r.data)
                    setState({
                        ...state,
                        user: user,
                        status: E_SendingStatus.success
                    })
                } else {
                    setState({
                        ...state,
                        status: E_SendingStatus.error,
                        error: r.error
                    })
                }
            })
            .catch(err => setErrorHandled(state, setState, 'status', err))
    }

    const dispatchChangeState = () => {
        setState(initialState)
    }

    return {
        vm: state,
        dispatchResetPassword,
        dispatchChangeState
    }
}
