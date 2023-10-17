import Image from "next/image";
import { useContext } from "react";

import JobCategory from "../components/homepage/job-category";
import WebsocketContext from "../store/websocket-context";

function HomePage() {
  //This is the home page the user sees when first opening the website.
  //It has three categories: active jobs, recent jobs and older jobs.
  //Users can click on a job to go to the job's detail page.
  const {
    isConnected,
    activeJobs,
    recentJobs,
    olderJobs,
    sendMessage,
    toggleDarkMode,
  } = useContext(WebsocketContext);

  if (!isConnected) {
    return (
      <div className="flex w-full flex-col justify-between px-10 font-jost md:mx-auto md:w-1/2 md:px-0 lg:w-1/2 ">
        <p className="opacity-4 pt-3 text-center">
          BreakTools Deadline Web App
        </p>
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

  return (
    <div className="lg:1/3 flex w-full flex-col justify-between px-10 pb-20  font-jost md:mx-auto md:w-2/3 md:px-0 2xl:w-1/3">
      <p className="pt-3 text-center opacity-40">BreakTools Deadline Web App</p>
      <button
        onClick={toggleDarkMode}
        className="mx-auto opacity-50 dark:invert"
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
      <JobCategory
        jobString="active_jobs"
        jobsList={activeJobs}
        sendMessage={sendMessage}
      />

      <JobCategory
        jobString="recent_jobs"
        jobsList={recentJobs}
        sendMessage={sendMessage}
      />

      <JobCategory
        jobString="older_jobs"
        jobsList={olderJobs}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default HomePage;
