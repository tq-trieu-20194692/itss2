import {App} from "../const/App";
import moment from "moment";
import {Normalize} from "../core/Normalize";
import {Model} from "./Model";

export type T_LoginVO = {
    username: string
    password: string
}

export type T_RegisterVO = {
    username: string
    password: string
    confirm: string
    name: string
    email: string
    address: string
    phone: string
    image: File
    birthdate: string
}

export type T_ResetPasswordVO ={
    password: string
    password_confirmation: string
}

export type T_ResetPasswordOTPVO ={
    password: string
    password_confirmation: string
    otp: string
    email: string
}

export class UserModel extends Model {
    id?: string
    name?: string
    username?: string
    email?: string
    image?: string
    isOwner?: boolean
    phone? :string
    address? :string
    activated2fa?:boolean
    accessToken?: AccessTokenModel
    createAt?:string
    updateAt?:string
    status?: boolean
    constructor(data: Record<string, any>) {
        super(data)
        this.id = Normalize.initJsonString(data, 'id')
        this.name = Normalize.initJsonString(data, 'name')
        this.phone = Normalize.initJsonString(data, 'phone')
        this.activated2fa = Normalize.initJsonBool(data, 'activated_2fa')
        this.username = Normalize.initJsonString(data, 'username')
        this.email = Normalize.initJsonString(data, 'email')
        this.image = Normalize.initJsonString(data, 'image')
        this.isOwner = Normalize.initJsonBool(data, 'is_owner')
        this.createAt = Normalize.initJsonString(data, 'create_at')
        this.updateAt = Normalize.initJsonString(data, 'update_at')
        this.accessToken = Normalize.initJsonObject(data, 'access_token', v => new AccessTokenModel(v))
    }
}

export class AccessTokenModel extends Model {
    token?: string
    abilities?: string[]
    expiresAt?: string
    updatedAt?: string
    createdAt?: string
    tokenType?:string
    expiresAtFormatted = (format: string = App.FormatToMoment): string => moment(this.expiresAt, App.FormatISOFromMoment).format(format)
    updatedAtFormatted = (format: string = App.FormatToMoment): string => moment(this.updatedAt, App.FormatISOFromMoment).format(format)
    createdAtFormatted = (format: string = App.FormatToMoment): string => moment(this.createdAt, App.FormatISOFromMoment).format(format)

    constructor(data: Record<string, any>) {
        super(data)
        this.token = Normalize.initJsonString(data, 'token')
        this.tokenType = Normalize.initJsonString(data, 'token_type')
        this.abilities = Normalize.initJsonArray(data, 'abilities')
        this.expiresAt = Normalize.initJsonString(data, 'expires_at')
        this.updatedAt = Normalize.initJsonString(data, 'updated_at')
        this.createdAt = Normalize.initJsonString(data, 'created_at')
    }
}
export class UserAgent extends Model{
    browser? :string
    device? :string
    platForm? :string
    constructor(data : Record<string, any>) {
        super(data);
        this.browser = Normalize.initJsonString(data, 'browser')
        this.device = Normalize.initJsonString(data, 'device')
        this.platForm = Normalize.initJsonString(data, 'platform')

    }
}
export class HistoryModel extends Model {
    createdAt?:string
    ip?:string
    userAgent?:UserAgent
    location?:string
    idSession?:string
    key? :string
    constructor(data: Record<string, any>) {
        super(data)
        this.ip = Normalize.initJsonString(data, 'ip')
        this.key = Normalize.initJsonString(data, 'key')
        this.createdAt = Normalize.initJsonString(data, 'created_at')
        this.userAgent =Normalize.initJsonObject(data, 'user_agent', v => new UserAgent(v))
        this.location =Normalize.initJsonString(data, 'location')
        this.idSession =Normalize.initJsonString(data, 'id_session')
    }
    copyFrom = (data: Record<string, any>): HistoryModel => {
        if (this.raw) {
            return new HistoryModel({...this.raw, ...data})
        } else {
            return new HistoryModel(data)
        }
    }
}
export class LoginHistoryModel extends Model{
    history?:HistoryModel
    constructor(data: Record<string, any>) {
        super(data)
        this.history =Normalize.initJsonObject(data, 'history', v => new HistoryModel(v))

    }
    copyFrom = (data: Record<string, any>): LoginHistoryModel => {
        if (this.raw) {
            return new LoginHistoryModel({...this.raw, ...data})
        } else {
            return new LoginHistoryModel(data)
        }
    }
}
