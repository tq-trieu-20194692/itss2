import {AxiosClient} from "./AxiosClient";
import {ApiResModel} from "../models/ApiResModel";
import {injectable} from "inversify";
import { T_LoginVO} from "../models/UserModel";

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

    getLoginHistory() :Promise<ApiResModel>{   //xem lịch sử login của tk đăng nhập
        return AxiosClient.get(`account/loginHistory`)
    }

    getDetailLogin(idSession?:string):Promise<ApiResModel>{   //xem detail 1 login
        return AxiosClient.get(`admin/loginHistory/${idSession}`)
    }
    postFarLogout(idSession:string): Promise<ApiResModel> {
        return AxiosClient.post(`admin/logout/${idSession}`);
    }



}
