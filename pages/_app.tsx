import { SessionProvider } from "@inrupt/solid-ui-react";
import Head from 'next/head'

interface IApp {
    Component: React.ComponentType<any>;
    pageProps: any;
}

export default function App(props: IApp): React.ReactElement {
    const { Component, pageProps } = props;

    const style = "body { background: linear-gradient(#F6F6F6, #E8E8E8) fixed; }"

    return (
        <div>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <style>
                    {style}
                </style>

                <title>GoalGoat</title>
            </Head>
            <SessionProvider>
                <Component {...pageProps} />
            </SessionProvider>
        </div>
    );
}
