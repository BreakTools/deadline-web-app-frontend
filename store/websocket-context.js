import { createContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

//This is here just so my IDE picks up the variables correctly.
const WebsocketContext = createContext({
  isConnected: null,
  activeJobs: null,
  recentJobs: null,
  olderJobs: null,
  jobDetails: null,
  aiText: null,
  previewImages: null,
  sendMessage: function () {},
  toggleDarkMode: function () {},
});

export function WebSocketContextProvider(props) {
  //This is the main function that handles all data i/o
  //between this client and the backend. We store the data that
  //we need in this context, so components in our web app
  //can subscribe to that data.
  const [isConnected, setIsConnected] = useState(false);

  const [activeJobs, setActiveJobs] = useState();
  const [recentJobs, setRecentJobs] = useState();
  const [olderJobs, setOlderJobs] = useState();
  const [jobDetails, setJobDetails] = useState();
  const [aiText, setAiText] = useState();
  const [previewImages, setPreviewImages] = useState({});

  const [cookies, setCookie] = useCookies();

  //I'm using both states and refs here for all the variables,
  //this makes sure we're always working with the latest data.
  //We update the state after we're done with the refs.
  var activeJobsRef = useRef();
  var recentJobsRef = useRef();
  var olderJobsRef = useRef();
  var jobDetailsRef = useRef();
  var aiTextRef = useRef({});
  var previewImagesRef = useRef({});
  const ws = useRef();

  //Initially setting the darkmode cookies.
  //Could've put this in another file but it's
  //teeny tiny darkmode code so it stays here.
  if (typeof cookies["darkMode"] == "undefined") {
    setCookie("darkMode", false, { sameSite: "Strict" });
  } else {
    if (cookies["darkMode"]) {
      window.document.body.classList.add("dark");
    }
  }

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(WEBSOCKET_URL);

      ws.current.onopen = () => {
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        updateData(parsedData);
      };

      ws.current.onclose = (e) => {
        //We reconnect after 3 seconds if connection closes.
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (err) => {
        ws.current.close();
      };
    };

    connectWebSocket();

    return () => {
      ws.current.close();
    };
  }, []);

  function updateData(parsedData) {
    //This function updates the data based on it's type.
    switch (parsedData.type) {
      case "active_jobs":
        activeJobsRef.current = getMergedData(
          parsedData,
          activeJobsRef.current
        );
        setActiveJobs(Object.assign({}, activeJobsRef.current));
        break;

      case "recent_jobs":
        if (typeof recentJobsRef.current != "undefined") {
          //We refresh active jobs if we get a new recent job to clear old data.
          sendMessage({
            body: `get_active_jobs`,
          });
        }

        recentJobsRef.current = getMergedData(
          parsedData,
          recentJobsRef.current
        );
        setRecentJobs(Object.assign({}, recentJobsRef.current));
        break;

      case "older_jobs":
        if (typeof olderJobsRef.current != "undefined") {
          //We refresh recent jobs if we get a new older job to clear old data.
          sendMessage({
            body: `get_recent_jobs`,
          });
        }

        olderJobsRef.current = getMergedData(parsedData, olderJobsRef.current);
        setOlderJobs(Object.assign({}, olderJobsRef.current));
        break;

      case "job_details":
        if (!parsedData.update) {
          //Unset the job lists so we'll fetch new data when we go
          //back to the home page.
          jobDetailsRef.current = parsedData.data;
          setActiveJobs(undefined);
          setRecentJobs(undefined);
          setOlderJobs(undefined);
        } else {
          jobDetailsRef.current = mergeObjects(
            jobDetailsRef.current,
            parsedData.data
          );
        }

        setJobDetails(Object.assign({}, jobDetailsRef.current));
        break;

      case "ai_text":
        //AI text is streamed in chunks, so we construct the string here.
        if (!parsedData.reset) {
          aiTextRef.current[parsedData.job_id] += parsedData.chunk;
        } else {
          aiTextRef.current[parsedData.job_id] = "";
        }

        setAiText(Object.assign({}, aiTextRef.current));
        break;

      case "image_preview":
        previewImagesRef.current[parsedData.task_id] = parsedData;
        setPreviewImages(Object.assign({}, previewImagesRef.current));
    }
  }

  function getMergedData(parsedData, dataTypeRef) {
    //This function merges fresh data into the existing object,
    //which means we don't have to send the full list all the time.

    //If this function runs, job details and images aren't being looked at so we reset them.
    setJobDetails(undefined);
    setPreviewImages({});
    previewImagesRef.current = {};

    if (!parsedData.update) {
      dataTypeRef = parsedData.data;
    } else {
      for (let job in parsedData.data) {
        if (!isJobInJobList(job, dataTypeRef)) {
          dataTypeRef[job] = parsedData.data[job];
        } else {
          dataTypeRef = mergeObjects(dataTypeRef, parsedData.data);
        }
      }
    }

    return dataTypeRef;
  }

  function isJobInJobList(job, jobList) {
    //Check if key exists in our object.
    if (typeof jobList[job] != "undefined") {
      return true;
    } else {
      return false;
    }
  }

  function mergeObjects(object1, object2) {
    //This spread operator merges the two objects.
    Object.keys(object1).forEach((key) => {
      object1[key] = {
        ...object1[key],
        ...object2[key],
      };
    });
    return object1;
  }

  function sendMessage(message) {
    //Convert to JSON and send it to server.
    ws.current.send(JSON.stringify(message));
  }

  function toggleDarkMode() {
    //This function toggles our Tailwind CSS darkmode.
    //Did not have another good place to put this without
    //making another global context.
    if (cookies["darkMode"]) {
      window.document.body.classList.remove("dark");
      setCookie("darkMode", false, { sameSite: "Strict" });
    } else {
      window.document.body.classList.add("dark");
      setCookie("darkMode", true, { sameSite: "Strict" });
    }
  }

  const context = {
    isConnected: isConnected,
    activeJobs: activeJobs,
    recentJobs: recentJobs,
    olderJobs: olderJobs,
    jobDetails: jobDetails,
    aiText: aiText,
    previewImages: previewImages,
    sendMessage: sendMessage,
    toggleDarkMode: toggleDarkMode,
  };

  return (
    <WebsocketContext.Provider value={context}>
      {props.children}
    </WebsocketContext.Provider>
  );
}

export default WebsocketContext;
