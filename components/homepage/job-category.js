import Image from "next/image";
import { useCookies } from "react-cookie";

import JobOverviewList from "./job-overview-list";

function JobCategory(props) {
  //This component shows our job overview list if we have data to display.
  //It also handles requesting data from the backend if the job category
  //is unfolded.
  const { jobString, jobsList, sendMessage } = props;
  const [cookies, setCookie] = useCookies();

  const jobText = jobString.replace("_", " ");

  //Dear European Union, these cookies are absolutely essential
  //to the functioning of this website.
  if (typeof cookies[`${jobString}`] == "undefined") {
    //Setting initial cookies if they haven't been set yet.
    //Active jobs should be unfolded in this case.
    if (jobString == "active_jobs") {
      setCookie(`${jobString}`, true, { sameSite: "Strict" });
    } else {
      setCookie(`${jobString}`, false, { sameSite: "Strict" });
    }
  }

  function toggleShowJobs() {
    //This function toggles showing the jobslist and also sets
    //the correct cookies so we store the page state.
    if (cookies[`${jobString}`]) {
      setCookie(`${jobString}`, false, { sameSite: "Strict" });
    } else {
      setCookie(`${jobString}`, true, { sameSite: "Strict" });
    }
  }

  if (!cookies[`${jobString}`]) {
    //This code runs if this job category should not be shown.
    return (
      <button onClick={toggleShowJobs}>
        <div className="flex w-full flex-row items-center justify-between pb-4">
          <p className="pb-2 text-3xl  font-bold">{`${jobText}`}</p>
          <Image
            src="icons/arrow-down-circle.svg"
            alt={`Open ${jobText}`}
            width={25}
            height={25}
            className="dark:invert"
          />
        </div>
      </button>
    );
  }

  if (typeof jobsList == "undefined") {
    //This code runs if we want to look at this job category
    //but we haven't yet received the data.
    sendMessage({
      body: `get_${jobString}`,
    });
  }

  //This runs if we want to show the job category and we have all our data.
  return (
    <div className="pb-4">
      <button onClick={toggleShowJobs} className="w-full">
        <div className="flex flex-row items-center justify-between">
          <p className="pb-2 text-3xl font-bold">{jobText}</p>
          <Image
            src="icons/arrow-down-circle.svg"
            alt={`Open ${jobText}`}
            width={25}
            height={25}
            className="rotate-180 dark:invert"
          />
        </div>
      </button>
      <JobOverviewList jobsList={jobsList} jobString={jobText} />
    </div>
  );
}

export default JobCategory;
