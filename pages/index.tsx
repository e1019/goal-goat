import { useEffect, useState } from "react";

import { BrowserRouter } from "react-router-dom";
import { useSession } from "@inrupt/solid-ui-react/dist";

import { doNotification } from "../util/Notification";
import MainApp from "../components/mainApp";
import LoginForm from "../components/loginForm";

export default function Home(): React.ReactElement {
    const { session } = useSession();
    const [ logging, setLogging ] = useState(null);

    useEffect(() => {
        doNotification();
        setLogging(location.href.includes("code") && location.href.includes("state"));
    }, [setLogging]);


    if (!session.info.isLoggedIn) {
        return <LoginForm loading={!(logging == false)} />;
    }

    return <BrowserRouter><MainApp session={session} /></BrowserRouter>;
}
