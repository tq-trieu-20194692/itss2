export class Validate {
    static readonly PHONE_FORMAT = /(84|0[3|5|7|8|9])+([0-9]{3,18})\b/
    static readonly EMAIL_FORMAT = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    static readonly USERNAME_FORMAT = /^[_A-z0-9]*((-)*[_A-z0-9])*$/
}
