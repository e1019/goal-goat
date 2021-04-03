import { useSession } from "@inrupt/solid-ui-react/dist";
import LoginForm from "../components/loginForm";
import MainApp from "../components/mainApp";



import {
    BrowserRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { doNotification } from "../util/Notification";
import { CircularProgress } from "@material-ui/core";



export default function Home(): React.ReactElement {
    const { session, isLoading } = useSession();
    const [ logging, setLogging ] = useState(null);

    useEffect(() => {
        doNotification();
        setLogging(location.href.includes("code") && location.href.includes("state"));
    }, [setLogging]);


    if (!session.info.isLoggedIn) {
        return <LoginForm loading={!(logging == false)} />;
    }

    return <BrowserRouter><MainApp session={session} /></BrowserRouter>
}
