import {E_SendingStatus} from "../../../const/Events";
import {setErrorHandled} from "../../CmAction";
import {useInjection} from "inversify-react";
import {ApiService} from "../../../repositories/ApiService";
import {useState} from "react";
import {initialState, T_ForgotPasswordOTPState} from "./ForgotPasswordOTPState";

export const ForgotPasswordOTPAction = () => {
    const apiService = useInjection(ApiService);
    const [state, setState] = useState<T_ForgotPasswordOTPState>(initialState);

    const dispatchForgotPasswordOTP = (username: string) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading,
        })

        apiService
            .forgotpasswordotp({username: username})
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
        dispatchForgotPasswordOTP
    };
};
