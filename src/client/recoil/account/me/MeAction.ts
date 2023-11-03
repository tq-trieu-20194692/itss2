import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {initialState, MeState} from "./MeState";
import {E_CookieKey, E_LSKey, E_SendingStatus} from "../../../const/Events";
import {ApiService} from "../../../repositories/ApiService";
import {UserModel} from "../../../models/UserModel";
import {setErrorHandled} from "../../CmAction";
import {useSessionContext} from "../../../presentation/contexts/SessionContext";
import {Utils} from "../../../core/Utils";
import {useInjection} from "inversify-react";
import {StoreConfig} from "../../../config/StoreConfig";
import {EDLocal} from "../../../core/encrypt/EDLocal";

export const MeAction = () => {
    const [session, setSession] = useSessionContext()

    const apiService = useInjection(ApiService)
    const storeConfig = useInjection(StoreConfig)

    const [state, setState] = useRecoilState(MeState)
    const vm = useRecoilValue(MeState)
    const resetState = useResetRecoilState(MeState)

    const dispatchLoadMe = () => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        })
        apiService
            .getMe()
            .then(r => {
                if (r.success) {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.success,
                        user: new UserModel(r.data)
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

    const dispatchSetMe = (user: UserModel) => {
        setState({
            ...state,
            user: user
        })
    }

    const dispatchUpdateMeImage = (data: Record<string, any>) => {
        if (!state.user) {
            return
        }

        const user = state.user

        if (data.hasOwnProperty('image')) {
            user.image = data.image;
        }
        dispatchStoreUser(user, true, false)
        setSession({
            ...session,
            user: user
        })

        setState({
            ...state,
            user: user
        })
    }

    const dispatchEditMe = (data: Partial<UserModel>) => {
        setState({
            ...state,
            isLoading: E_SendingStatus.loading
        });

        // Tạo một bản sao của người dùng hiện tại
        const updatedUser = new UserModel({
            ...state.user
        });

        // Cập nhật trường dữ liệu mới từ đối tượng `data`
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                updatedUser[key] = data[key];
            }
        }

        // Gửi dữ liệu người dùng đã cập nhật đến dịch vụ API
        apiService.editMe(updatedUser).then(
            (r) => {
                if (r.success) {
                    setState({
                        ...state,
                        user: updatedUser, // Cập nhật trạng thái Recoil với người dùng đã cập nhật
                        isLoading: E_SendingStatus.success,
                    });

                    // Cập nhật ngữ cảnh phiên và lưu trữ dữ liệu người dùng bằng cách sử dụng dispatchStoreUser
                    dispatchStoreUser(updatedUser, true, true);
                } else {
                    setState({
                        ...state,
                        isLoading: E_SendingStatus.error,
                        error: r.error,
                    });
                }
            }
        ).catch((err) => setErrorHandled(state, setState, 'state', err));
    }



    const dispatchStoreUser = (user: UserModel, isLS: boolean = true, isCookie: boolean = true) => {
        storeConfig.accessToken = user.accessToken
        // set localStorage
        if (isLS) {
            EDLocal.setLocalStore(E_LSKey.User, Utils.rmObjectByValue(user.toObject()))
        }
        // set cookie
        if (isCookie) {
            if (user.accessToken) {
                EDLocal.setCookie(E_CookieKey.User, Utils.rmObjectByValue(user.accessToken.toObject()))
            }
        }
        dispatchSetMe(user)
    }

    const dispatchClearUser = () => {
        console.log("MeAction: dispatchClearUser")

        // clear store singleton
        storeConfig.accessToken = undefined

        // remove localStorage
        EDLocal.removeLocalStore('user')

        // remove cookie
        EDLocal.removeCookie('user')

        // clear recoil
        setState({
            ...state,
            ...initialState,
            user: undefined,
            error: undefined
        })
    }

    return {
        vm,
        dispatchLoadMe,
        dispatchSetMe,
        dispatchEditMe,
        dispatchUpdateMeImage,
        dispatchStoreUser,
        dispatchClearUser,
        dispatchResetState: resetState
    }
}
