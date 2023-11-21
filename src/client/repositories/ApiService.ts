import {AxiosClient} from "./AxiosClient";
import {ApiResModel} from "../models/ApiResModel";
import {injectable} from "inversify";
import {T_ChangePasswordVO, T_LoginVO, T_QueryVO, T_ResetPasswordOTPVO, T_ResetPasswordVO, UserModel} from "../models/UserModel";
import {DiaryModel} from "../models/DiaryModel";
import {T_FormAddDiary, T_FormEditDiary} from "../presentation/screens/homepage/DiaryWidget";

@injectable()
export class ApiService {
    init(): Promise<ApiResModel> {
        return AxiosClient.get("init-web")
    }

    tracking(): Promise<ApiResModel> {
        return AxiosClient.get("tracking-web")
    }

    login(data: T_LoginVO): Promise<ApiResModel> {
        return AxiosClient.post("auth/login", data);
    }

    logout(): Promise<ApiResModel> {
        return AxiosClient.post("account/logout");
    }

    getMe(): Promise<ApiResModel> {
        return AxiosClient.get("account/me")
    }

    editMe(data?: UserModel): Promise<ApiResModel> {
        return AxiosClient.put("account/edit", data)
    }

    changePassword(data: T_ChangePasswordVO): Promise<ApiResModel> {
        return AxiosClient.post("account/changePassword", data)
    }

    //emailVerify()

    getLoginHistory(): Promise<ApiResModel> {   //xem lịch sử login của tk đăng nhập
        return AxiosClient.get(`account/loginHistory`)
    }

    getActivites(query?: T_QueryVO): Promise<ApiResModel> {
        return AxiosClient.get(`account/activity`, query)
    }

    forgotpassword(data: { username: string }): Promise<ApiResModel> {
        return AxiosClient.post("reset-password/get-link", data);
    }

    resetpassword(data: T_ResetPasswordVO): Promise<ApiResModel> {
        return AxiosClient.post("reset-password/reset", data);
    }

    forgotpasswordotp(data: { username: string }): Promise<ApiResModel> {
        return AxiosClient.post("reset-password/send-OTP", data);
    }

    resetpasswordotp(data: T_ResetPasswordOTPVO): Promise<ApiResModel> {
        return AxiosClient.post("reset-password/otp", data);
    }

    register(data: FormData): Promise<ApiResModel> {
        return AxiosClient.post("register", data, true);
    }

    postFarLogout(idSession: string): Promise<ApiResModel> {
        return AxiosClient.post(`account/logout/${idSession}`);
    }

    getListDiary(query?: T_QueryVO): Promise<ApiResModel> {
        return AxiosClient.get(`diary`, query)
    }

    addDiary(data?:T_FormAddDiary): Promise<ApiResModel> {
        return AxiosClient.post(`diary/create`, data)
    }

    editListDiary(id: string | undefined, data?: T_FormEditDiary): Promise<ApiResModel> {
        return AxiosClient.post(`diary/edit/${id}`, data)
    }

    deleteListDiary(id: string | undefined, data?: any): Promise<ApiResModel> {
        return AxiosClient.post(`diary/delete/${id}`, data)
    }

    getListDiaryPost(idPost: string | undefined, query?: T_QueryVO): Promise<ApiResModel> {
        return AxiosClient.get(`diary/${idPost}/posts`, query)
    }

    editDiaryPost(diaryPostId: string | undefined, data?: any): Promise<ApiResModel> {
        return AxiosClient.post(`diary/post/edit/${diaryPostId}`, data);
    }

    deleteDiaryPost(diaryPostId: string, data?: any): Promise<ApiResModel> {
        return AxiosClient.post(`diary/post/delete/${diaryPostId}`, data);
    }


}
