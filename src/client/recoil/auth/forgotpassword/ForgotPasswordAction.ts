import {E_SendingStatus} from "../../../const/Events";
import {setErrorHandled} from "../../CmAction";
import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useState} from "react";
import {initialState, T_ForgotPasswordState} from "./ForgotPasswordState";

export const ForgotPasswordAction = () => {
    const apiService = useInjection(ApiService);
    const [state, setState] = useState<T_ForgotPasswordState>(initialState);

    const dispatchForgotPassword = (username: string) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading,
        })

        apiService
            .forgotpassword({username: username})
            .then(r => {
                if (r.success) {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.success,
                    });
                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                    });
                }
            })
            .catch(err => setErrorHandled(state, setState, 'status', err));
    };

    return {
        vm: state,
        dispatchForgotPassword
    };
};
