import {initialState, T_ResetPasswordOTPState} from "./ResetPasswordOTPState";
import {ApiService} from "../../../repositories/ApiService";
import {T_ResetPasswordOTPVO, UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {MeAction} from "../me/MeAction";
import {useSessionContext} from "../../../presentation/contexts/SessionContext";
import {useInjection} from "inversify-react";
import {E_SendingStatus} from "../../../const/Events";
import {useState} from "react";


export const ResetPasswordOTPAction = () => {
    // const [session, setSession] = useSessionContext()
    const apiService = useInjection(ApiService)

    const [state, setState] = useState<T_ResetPasswordOTPState>(initialState)

    const dispatchResetPassword = (data: T_ResetPasswordOTPVO) => {
        setState({
            ...state,
            status: E_SendingStatus.loading
        })

        apiService
            .resetpasswordotp(data)
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
