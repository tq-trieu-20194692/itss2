import React, {ReactNode} from 'react'
import {CContainer, CHeader} from '@coreui/react'
import {useNavigate} from "react-router";

type _T_Props = {
    tool?: ReactNode
    onReload?: Function
}

const AppHeaderChangePassword = (props: _T_Props) => {
    const navigate = useNavigate()
    return (
        <CHeader position="sticky" className="mb-6" style={{
            backgroundColor: "#001529",  // Change background color to gray

        }}>
            <CContainer fluid>
                <div style={{fontSize:'20px',color:'whitesmoke'}}>
                    <img src="/logo.svg" style={{
                        width:'32px',
                        height:'32px',
                        marginRight:'5px'
                    }} alt=""/>
                    AUTOTIMELAPSE
                </div>
            </CContainer>
        </CHeader>
    )
}

export default AppHeaderChangePassword