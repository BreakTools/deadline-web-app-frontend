import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import InfoDisplayBox from "../components/job-detail-page/info-display-box";
import TasksListBox from "../components/job-detail-page/tasks-list-box";
import ProgressBar from "../components/progress-bar";
import NotificationContext from "../store/notification-context";
import WebsocketContext from "../store/websocket-context";

function JobDetailPage(props) {
  //This is the job detail page, where all information regarding a job is shown.
  //I tried splitting stuff up but there's a lot going on here so this file
  //is still larger than I would like. But oh well.
  const { isConnected, jobDetails, aiText, sendMessage, toggleDarkMode } =
    useContext(WebsocketContext);
  const { getNotificationPermission, sendNotification } =
    useContext(NotificationContext);
  const { jobId } = props;
  const totalChunks = useRef();
  const [loadedJob, setLoadedJob] = useState(false);
  const [notificationIconState, setNotificationIconState] =
    useState("/icons/bell.svg");
  const notificationRef = useRef(false);

  useEffect(() => {
    //This effect requests the Job Details once we connect,
    //it's needed for when a user loads this page directly
    //instead of going through the homepage.
    if (isConnected) {
      sendMessage({
        body: "get_job_details",
        jobId: jobId,
      });
    }
  }, [isConnected]);

  useEffect(() => {
    //This effect handles job data changes so the UI
    //updates accordingly. It also checks if a job is
    //finished for user notifications.
    if (typeof jobDetails != "undefined") {
      if (jobDetails.type != "error") {
        totalChunks.current =
          parseInt(jobDetails.job.Completed) +
          parseInt(jobDetails.job.Failed) +
          parseInt(jobDetails.job.Pending) +
          parseInt(jobDetails.job.Queued) +
          parseInt(jobDetails.job.Rendering) +
          parseInt(jobDetails.job.Suspended);

        if (
          totalChunks.current == jobDetails.job.Completed &&
          notificationRef.current == true
        ) {
          sendNotification("Deadline Web App", {
            body: `${Name} has finished rendering!`,
          });
        }

        if (
          totalChunks.current == jobDetails.job.Failed &&
          notificationRef.current == true
        ) {
          sendNotification("Deadline Web App", {
            body: "Your render has failed...",
          });
        }
      }
      setLoadedJob(true);
    }
  }, [jobDetails]);

  function toggleNotification() {
    //This function handles the switching of the
    //job notification. It also updates the bell icon.
    if (!notificationRef.current) {
      notificationRef.current = true;
      setNotificationIconState("/icons/bell-notification.svg");
      getNotificationPermission();
    } else {
      notificationRef.current = false;
      setNotificationIconState("/icons/bell.svg");
    }
  }

  if (!isConnected) {
    //If we're not connected, show the loading screen.
    return (
      <div className="flex w-full flex-col justify-between px-10 font-jost md:mx-auto md:w-1/2 md:px-0">
        <p className="text-center opacity-40">BreakTools Deadline Web App</p>
        <div className="mt-10 flex h-screen flex-col items-center justify-center">
          <Image
            src="/icons/ring-resize.svg"
            width={50}
            height={50}
            alt="Loading spinner"
          />
          <p className="text-2xl">Connecting...</p>
        </div>
      </div>
    );
  }

  if (typeof jobDetails == "undefined" || !loadedJob) {
    //Our job is still loading if it's undefined or not loaded,
    //so we return a loading icon here.
    return (
      <div className="flex w-full flex-col justify-between px-10 font-jost md:mx-auto md:w-1/2 md:px-0">
        <p className="text-center opacity-40">BreakTools Deadline Web App</p>
        <div className="mt-10 flex h-screen flex-col items-center justify-center">
          <Image
            src="/icons/ring-resize.svg"
            width={50}
            height={50}
            alt="Loading spinner"
          />
          <p className="text-2xl">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (jobDetails.type == "error") {
    //The backend returns an error type for when the job doesn't exists,
    //so we show the job error here.
    return (
      <div className="w-screen pt-10">
        <p className="mx-auto mb-1 box-border w-1/2 rounded-xl bg-white p-4 text-center text-xl shadow-lg dark:bg-background_secondary_dark">
          The job you requested doesn't exist.
        </p>
      </div>
    );
  }

  //Code from here on only runs if our job is loaded correctly
  const {
    Name,
    User,
    Submit_Date,
    Completed,
    Failed,
    Rendering,
    Errors,
    Estimated_Time_Remaining,
    Average_Task_Time,
  } = jobDetails.job;

  //Little if check here to prevent an almost complete job from
  //rounding to 100%.
  var completedPercentage = (Completed / totalChunks.current) * 100;
  if (completedPercentage > 99 && completedPercentage != 100) {
    completedPercentage = 99;
  } else {
    completedPercentage = Math.round(completedPercentage);
  }

  //The AI text block updates rapidly because it receives
  //individual words from the backend. I put this part of the code
  //here to avoid a more nested mess further down.
  var aiTextBlock = (
    <div className="mt-4 pl-1 dark:invert">
      <Image
        src="/icons/ring-resize.svg"
        width={22}
        height={22}
        alt="Loading spinner"
      />
    </div>
  );

  if (typeof aiText != "undefined") {
    if (aiText[jobId] != "" && typeof aiText[jobId] != "undefined") {
      aiTextBlock = (
        <p className="md:text-md mx-4 break-all py-3 text-left text-lg">
          {aiText[jobId].replace(/\//g, "∕")}
        </p>
      );
    }
  }

  return (
    <div>
      <div className="w-full items-center px-4 pt-3 text-right font-jost md:mx-auto md:w-3/4 md:px-0 md:pt-10 lg:w-1/2">
        <div className="flex flex-row justify-between">
          <button
            onClick={toggleDarkMode}
            className="mb-3 ml-1 opacity-50 dark:invert"
          >
            {window.document.body.classList.contains("dark") ? (
              <Image
                src="/icons/sun-light.svg"
                width={25}
                height={25}
                alt="Dark mode"
              />
            ) : (
              <Image
                src="/icons/half-moon.svg"
                width={25}
                height={25}
                alt="Light mode"
              />
            )}
          </button>
          <Link href="/">
            <Image
              src="/icons/long-arrow-up-left.svg"
              width={40}
              height={40}
              alt="Back to homepage"
              className="mb-4 dark:invert"
            />
          </Link>
        </div>

        <div className="box-border rounded-xl bg-white p-4 shadow-lg dark:bg-background_secondary_dark">
          <div className="flex flex-row pb-2 pt-1">
            <div className="my-auto justify-self-start overflow-auto">
              <p className="break-all pr-10 text-left text-xl font-bold md:text-2xl">
                {Name.replace(/\//g, "∕")}
              </p>
              <p className="break-all text-left text-2xl md:text-lg">{User}</p>
            </div>
            <div className="ml-auto flex flex-col">
              <button onClick={toggleNotification}>
                <Image
                  src={notificationIconState}
                  width={35}
                  height={35}
                  alt="Enable notifications"
                  className=" mb-3 ml-auto transition-transform duration-300 hover:scale-110 dark:invert "
                />
              </button>
              <p className="text-right text-2xl font-bold md:text-4xl">
                {completedPercentage}%
              </p>
            </div>
          </div>

          <ProgressBar
            completedChunks={Completed}
            renderingChunks={Rendering}
            failedChunks={Failed}
            errs={Errors}
            totalChunks={totalChunks.current}
          />

          <div className="flex flex-col justify-center pt-5 md:flex-row md:space-x-4 ">
            <div className="flex flex-col md:mb-4 md:flex-row md:space-x-4 ">
              <InfoDisplayBox
                color="bg-background_secondary dark:bg-background_dark"
                text="Tasks completed"
                value={`${Completed} / ${totalChunks.current}`}
              />
              <InfoDisplayBox
                color="bg-background_secondary dark:bg-background_dark"
                text="Average frame time"
                value={`${Average_Task_Time}`}
              />
            </div>

            <div className=" flex flex-row space-x-4 md:pb-4">
              <InfoDisplayBox
                color="bg-warning"
                text="Warnings"
                value={`${Errors}`}
              />
              <InfoDisplayBox
                color="bg-error"
                text="Failed tasks"
                value={`${Failed}`}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center pb-4 md:mx-auto md:flex-row md:space-x-4">
            <InfoDisplayBox
              color="bg-background_secondary dark:bg-background_dark"
              text="Time started"
              value={`${Submit_Date}`}
            />
            <InfoDisplayBox
              color="bg-background_secondary dark:bg-background_dark"
              text="Estimated time left"
              value={`${Estimated_Time_Remaining}`}
            />
          </div>
          <div className="flex max-h-72 overflow-y-auto rounded-xl bg-background shadow-md dark:bg-background_dark">
            <Image
              src="/icons/cpu.svg"
              width={22}
              height={22}
              alt="ai icon"
              className="mb-4 ml-4 mt-4 self-start dark:invert"
            />
            {aiTextBlock}
          </div>
        </div>
      </div>
      <TasksListBox tasks={jobDetails.tasks} jobId={jobId} />
    </div>
  );
}

export async function getServerSideProps(context) {
  //I'm using getServerSideProps here because useRouter
  //gave me inconsistent results.
  const { params } = context;

  const jobId = params.jobId;

  return {
    props: {
      jobId: jobId,
    },
  };
}

export default JobDetailPage;
