import axios, {AxiosRequestConfig, CancelToken} from "axios";
import {getLng} from "../locales/i18n";
import {App} from "../const/App";
import {ApiResModel} from "../models/ApiResModel";
import moment from "moment";
import {Color} from "../const/Color";
import {EDData} from "../core/encrypt/EDData";
import {StoreConfig} from "../config/StoreConfig";

type _T_OsDataHeader = {
    agent?: Record<string, any>
    langCode?: string
    platform?: string
}

export class AxiosClient {
    static readonly Config = (isUp: boolean = false): AxiosRequestConfig => {
        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": isUp ? "multipart/form-data" : "text/json",
                // "Lang-Code": lng ?? 'vi',
                // "Platform": "web"
            },
            withCredentials: false
        }

        if (!isUp) {
            config.headers!.Accept = "application/json";
        }

        const storeConfig = StoreConfig.getInstance()

        if (storeConfig.accessToken && storeConfig.accessToken.token && storeConfig.accessToken.token.length > 0) {
            console.log('accessToken', storeConfig.accessToken.token)

            config.headers!.Authorization = `Bearer ${storeConfig.accessToken.token}`
        }

        const osData: _T_OsDataHeader = {
            langCode: getLng() ?? 'vi',
            platform: 'web'
        }

        // config.headers!['os-data'] = EDData.setData(osData)

        return config;
    }

    public static async get(path: string, query?: any, cancelToken?: CancelToken): Promise<ApiResModel> {
        // const ep = EDFile.setLinkUrl({
        //     p: path,
        //     q: AxiosClient.convertDataGet(query),
        //     e: moment().add(30, 'seconds').unix()
        // })

        console.log('%c<-GET--------------------------------------------', Color.ConsoleInfo);
        console.log(`[${moment().format(App.FormatTimeFull)}] PATH: ${path}`);

        console.log(`QUERY:`, query);
        const  q = AxiosClient.convertDataGet(query)
        const r = await axios
            .get(`${App.ApiUrl}/${path}?${q}`, cancelToken
                ? {
                    ...AxiosClient.Config(),
                    ...{
                        cancelToken: cancelToken,
                    }
                }
                : AxiosClient.Config());
        // const data_1 = r.data;

        const data_1 = EDData.getData(r.data) ?? r.data;
        console.log('RES:', data_1);
        console.log('%c--END------------------------------------------->', Color.ConsoleInfo);
        return new ApiResModel(data_1);
    }

    public static async post(
        path: string,
        data?: any,
        isUp: boolean = false,
        config?: AxiosRequestConfig,
    ): Promise<ApiResModel> {

        console.log('%c<-POST-------------------------------------------', Color.ConsoleInfo);
        console.log(`[${moment().format(App.FormatTimeFull)}] PATH: ${path}`);

        const r = await axios
            .post(`${App.ApiUrl}/${path}`, data, config ?? AxiosClient.Config(isUp))
        console.log(r);
        // const data_1 = r.data;

        const data_1 = EDData.getData(r.data) ?? r.data;
        console.log(r.data);
        console.log('RES:', data_1);
        console.log('%c--END------------------------------------------->', Color.ConsoleInfo);
        return new ApiResModel(data_1);
    }

    public static async put(
        path: string,
        data?: any,
        isUp: boolean = false,
        config?: AxiosRequestConfig
    ): Promise<ApiResModel> {

        console.log('%c<-PUT--------------------------------------------', Color.ConsoleInfo);
        console.log(`[${moment().format(App.FormatTimeFull)}] PATH: ${path}`);

        const r = await axios
            .put(`${App.ApiUrl}/${path}`, data, config ?? AxiosClient.Config(isUp));
        const data_1 = EDData.getData(r.data) ?? r.data;
        console.log('RES:', data_1);
        console.log('%c--END------------------------------------------->', Color.ConsoleInfo);
        return new ApiResModel(data_1);
    }

    public static async delete(
        path: string,
        config: AxiosRequestConfig = AxiosClient.Config()
    ): Promise<ApiResModel> {

        console.log('%c<-DELETE--------------------------------------------', Color.ConsoleInfo);
        console.log(`[${moment().format(App.FormatTimeFull)}] PATH: ${path}`);

        const r = await axios
            .delete(`${App.ApiUrl}/${path}`, config);
        const data = EDData.getData(r.data) ?? r.data;
        console.log('RES:', data);
        console.log('%c--END------------------------------------------->', Color.ConsoleInfo);
        return new ApiResModel(data);
    }

    // public static convertDataGet(data: any, prefix: string = '') {
    //     const cv: any = {};
    //
    //     if (typeof data === "object") {
    //         Object.entries(data as any).forEach(([key, value]) => {
    //             if (isObject(value) && !isArray(value)) {
    //                 Object.assign(cv, AxiosClient.convertDataGet(value, prefix.length > 0 ? `${prefix}_${key}` : key));
    //             } else {
    //                 cv[prefix.length > 0 ? `${prefix}_${key}` : key] = value;
    //             }
    //         });
    //     }
    //
    //     return cv;
    // }
    public static convertDataGet(data: any) {
        let cv: string = ""
        if (typeof data === "object") {
            Object.entries(data).forEach(([key, value]) => {
                if (value) {
                    cv = `${cv}&${key}=${value}`
                }
            })
        }
        if(data===undefined)
        {
            return ""
        }

        return cv
    }
}
