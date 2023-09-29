import {initialState, T_RegisterState} from "./RegisterState";
import {ApiService} from "../../../repositories/ApiService";
import {T_RegisterVO, UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {MeAction} from "../me/MeAction";
import {useSessionContext} from "../../../presentation/contexts/SessionContext";
import {useInjection} from "inversify-react";
import {E_SendingStatus} from "../../../const/Events";
import {useState} from "react";

export const RegisterAction = () => {
    const [session, setSession] = useSessionContext()
    const apiService = useInjection(ApiService)

    const {
        dispatchStoreUser
    } = MeAction()

    const [state, setState] = useState<T_RegisterState>(initialState)

    const dispatchRegister = (data: T_RegisterVO) => {
        setState({
            ...state,
            status: E_SendingStatus.loading
        })

        apiService
            .register(data)
            .then(r => {
                console.log(r)
                if (r.success) {
                    const user = new UserModel(r.data)

                    dispatchStoreUser(user)

                    setSession({
                        ...session,
                        isAuthenticated: true,
                        user: user
                    })

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
        dispatchRegister,
        dispatchResetState
    }
}
