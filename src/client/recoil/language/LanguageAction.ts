import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {LanguageState} from "./LanguageState";
import {_TLangCode, setLng} from "../../locales/i18n";

export const LanguageAction = () => {
    const [state, setState] = useRecoilState(LanguageState)
    const vm = useRecoilValue(LanguageState)
    const resetState = useResetRecoilState(LanguageState)

    const dispatchSetLanguage = (value: _TLangCode,num:number) => {
        setState({
            ...state,
            language: value,
            check:2,
            languageNum:num
        })
    }
    return {
        vm,
        dispatchSetLanguage,
        dispatchResetState: resetState
    }

}