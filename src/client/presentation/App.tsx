import "../require"
import {Route, Routes} from "react-router";
import {MasterLayout} from "./layouts/MasterLayout";
import {ChangePasswordLayout} from "./layouts/ChangePasswordLayout";
import React, {lazy, Suspense} from "react";
import {RouteConfig} from "../config/RouteConfig";
import {PrivateRoute} from "./layouts/PrivateRoute";
import {Navigate} from "react-router-dom";
import {SuspenseLoadingWidget} from "./widgets/SuspenseLoadingWidget";
import {HomePageLayout} from "./layouts/HomePageLayout";

const LoginScreen = lazy(() => import("./screens/auth/LoginScreen"));
const NotFound = lazy(() => import("./screens/NotFound"));
const App = ({...props}) => {
    return (
        <Suspense fallback={<SuspenseLoadingWidget/>}>
            <Routes>
                <Route path={RouteConfig.LOGIN} element={<LoginScreen/>}/>
                <Route element={<ChangePasswordLayout/>} {...props}>
                    {
                        RouteConfig.changePasswordRoutes.map((route, idx) => (
                            route.component && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        route.protect
                                            ? <PrivateRoute component={route.component}/>
                                            : <route.component/>
                                    }
                                />
                            )
                        ))
                    }
                </Route>
                <Route element={<HomePageLayout/>} {...props}>
                    {
                        RouteConfig.homePageRoute.map((route, idx) => (
                            route.component && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        route.protect
                                            ? <PrivateRoute component={route.component}/>
                                            : <route.component/>
                                    }
                                />
                            )
                        ))
                    }
                </Route>
                <Route element={<MasterLayout/>} {...props}>
                    {
                        RouteConfig.masterRoutes.map((route, idx) => (
                            route.component && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        route.protect
                                            ? <PrivateRoute component={route.component}/>
                                            : <route.component/>
                                    }
                                />
                            )
                        ))
                    }
                    <Route path="/" element={<Navigate to={RouteConfig.DASHBOARD} replace/>}/>
                </Route>
                <Route path={RouteConfig.NOT_FOUND} element={<NotFound/>}/>
            </Routes>
        </Suspense>
    )
}

export default App;
