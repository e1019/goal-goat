import { useSession } from "@inrupt/solid-ui-react/dist";
import LoginForm from "../components/loginForm";
import MainApp from "../components/mainApp";



import {
    BrowserRouter,
} from "react-router-dom";
import { useEffect } from "react";
import { doNotification } from "../util/Notification";



export default function Home(): React.ReactElement {
    const { session, isLoading } = useSession();

    useEffect(() => {
        doNotification();
    }, []);

    if(isLoading){
        return <p>Please wait, you are being logged in...</p>;
    }

    if (!session.info.isLoggedIn) {
        return <LoginForm />;
    }

    return <BrowserRouter><MainApp session={session} /></BrowserRouter>
}
