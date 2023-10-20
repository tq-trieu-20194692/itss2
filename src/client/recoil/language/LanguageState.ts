import {E_SendingStatus} from "../../const/Events";
import {atom} from "recoil";
import {KeyLanguage} from "../KeyRecoil";
import {_TLangCode} from "../../locales/i18n";

type T_LanguageState = {
    language: _TLangCode
    check: number
    error?: Record<string, any>
}

export const initialState: T_LanguageState = {
    language: 'vi',
    check:1
}
export const LanguageState = atom<T_LanguageState>({
    key: KeyLanguage,
    default: initialState
})