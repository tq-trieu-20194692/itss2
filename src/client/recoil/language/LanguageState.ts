import {E_SendingStatus} from "../../const/Events";
import {atom} from "recoil";
import {KeyLanguage} from "../KeyRecoil";
import {_TLangCode} from "../../locales/i18n";

type T_LanguageState = {
    language: _TLangCode
    error?: Record<string, any>
}

export const initialState: T_LanguageState = {
    language: 'vi'
}
export const LanguageState = atom<T_LanguageState>({
    key: KeyLanguage,
    default: initialState
})