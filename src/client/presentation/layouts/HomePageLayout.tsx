import React, {FC, ReactNode, useEffect, useState} from "react";
import {Outlet, useOutletContext} from "react-router";
import {CContainer} from "@coreui/react";
import AppHeaderForHomePage from "./components/AppHeaderForHomePage";

export type T_MasterCtx = {
    tool: [ReactNode, (tool: ReactNode) => void]
}

export const HomePageLayout: FC = _ => {
    const [tool, setTool] = useState<ReactNode>(null)

    const outletCtx: T_MasterCtx = {
        tool: [tool, setTool]
    }

    return (
        <div>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeaderForHomePage tool={tool}/>
                <div className="body flex-grow-1 px-2">
                    <CContainer fluid>
                        <Outlet context={outletCtx}/>
                    </CContainer>
                </div>
            </div>
        </div>
    )
}

type _T_Props = {
    children: ReactNode,
    tool?: ReactNode
}

export const MasterLayoutCtxWrapper: FC<_T_Props> = props => {
    const {master} = useMasterLayout()

    useEffect(() => {
        const [, setTool] = master.tool

        if (props.tool) {
            setTool(props.tool)
        }

        return () => setTool(null)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tool])

    return (
        <>
            {props.children}
        </>
    )
}

export const useMasterLayout = () => {
    const outletContext = useOutletContext<T_MasterCtx>()

    return {
        master: outletContext
    }
}
