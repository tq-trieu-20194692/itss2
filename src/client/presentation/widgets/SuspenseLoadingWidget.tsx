import {CSpinner} from "@coreui/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {notification} from "antd";
import {LanguageAction} from "../../recoil/language/LanguageAction";

export const SuspenseLoadingWidget= () => {
    // const {t} = useTranslation();
    // const {
    //     vm:vmLanguage,
    // } = LanguageAction()
    // const mess = t('text.changeLanguageSuccess')
    // useEffect(() => {
    //     if (mess&&vmLanguage.check!==1) {
    //         // Show notification after the transition
    //         notification.success({
    //             message: mess,
    //             duration: 1,
    //         });
    //     }
    // }, [mess]);
    return (
        <div className={'w-screen h-screen flex justify-center items-center'}>
            <CSpinner color="primary"/>
        </div>
    )
}