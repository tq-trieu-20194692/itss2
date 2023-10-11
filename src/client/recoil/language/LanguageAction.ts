import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {LanguageState} from "./LanguageState";
import {_TLangCode, setLng} from "../../locales/i18n";

export const LanguageAction = () => {
    const [state, setState] = useRecoilState(LanguageState)
    const vm = useRecoilValue(LanguageState)
    const resetState = useResetRecoilState(LanguageState)

    const dispatchSetLanguage = (value: _TLangCode) => {
        setState({
            ...state,
            language: value
        })
    }
    return {
        vm,
        dispatchSetLanguage,
        dispatchResetState: resetState
    }

}