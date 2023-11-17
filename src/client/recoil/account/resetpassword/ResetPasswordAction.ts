import {initialState, T_ResetPasswordState} from "./ResetPasswordState";
import {ApiService} from "../../../repositories/ApiService";
import {T_ResetPasswordVO, UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {useInjection} from "inversify-react";
import {E_SendingStatus} from "../../../const/Events";
import {useState} from "react";

export const ResetPasswordAction = () => {
    const apiService = useInjection(ApiService)
    const [state, setState] = useState<T_ResetPasswordState>(initialState)

    const dispatchResetPassword = (data: T_ResetPasswordVO) => {
        setState({
            ...state,
            status: E_SendingStatus.loading
        })

        apiService
            .resetpassword(data)
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

    const dispatchResetState = () => {
        setState(initialState)
    }

    return {
        vm: state,
        dispatchResetPassword,
        dispatchResetState
    }
}
