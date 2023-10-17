import { Jost } from "next/font/google";
import Head from "next/head";

import { NotificationContextProvider } from "../store/notification-context";
import { WebSocketContextProvider } from "../store/websocket-context";
import "../styles/globals.css";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

function MyApp({ Component, pageProps }) {
  return (
    <WebSocketContextProvider>
      <NotificationContextProvider>
        <div
          className={`App ${jost.variable} min-h-screen bg-background dark:bg-background_dark dark:text-background_secondary`}
        >
          <Head>
            <title>Deadline Web App</title>
          </Head>
          <Component {...pageProps} />
        </div>
      </NotificationContextProvider>
    </WebSocketContextProvider>
  );
}

export default MyApp;
