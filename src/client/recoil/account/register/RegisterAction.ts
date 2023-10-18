import {initialFormState, initialState, T_CommonState, T_RegisterState} from "./RegisterState";
import {ApiService} from "../../../repositories/ApiService";
import {T_RegisterVO, UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {useInjection} from "inversify-react";
import {E_SendingStatus} from "../../../const/Events";
import {useState} from "react";

export const RegisterAction = () => {
    const apiService = useInjection(ApiService)
    const [formState,setFormState] = useState<T_CommonState>(initialFormState)
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
                    setState({
                        ...state,
                        user: user,
                        status: E_SendingStatus.success
                    })
                    setFormState({
                        ...state,
                        isLoading:E_SendingStatus.success
                    })
                } else {
                    setState({
                        ...state,
                        status: E_SendingStatus.error,
                        error: r.error
                    })
                    setFormState({
                        ...state,
                        isLoading: E_SendingStatus.error,
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
        vmForm:formState,
        dispatchRegister,
        dispatchResetState
    }
}
