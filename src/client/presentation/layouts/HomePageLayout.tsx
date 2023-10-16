import {FC, ReactNode, useEffect, useState} from "react";
import AppHeader from "./components/AppHeaderHomePage";
import {Outlet, useOutletContext} from "react-router";
import {CContainer} from "@coreui/react";
import AppFooter from "./components/AppFooter";


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
                <AppHeader tool={tool}/>
                <div className="body flex-grow-1 px-2">
                    <CContainer fluid>
                        <Outlet context={outletCtx}/>
                    </CContainer>
                </div>
                <AppFooter/>
            </div>
        </div>
    )
}

type _T_Props = {
    children: ReactNode,
    tool?: ReactNode
}

export const HomePageLayoutCtxWrapper: FC<_T_Props> = props => {
    const {master} = useHomePageLayout()

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

export const useHomePageLayout = () => {
    const outletContext = useOutletContext<T_MasterCtx>()

    return {
        master: outletContext
    }
}
