import Image from "next/image";
import JobOverviewItem from "./job-overview-item";

function JobOverviewList(props) {
  //This component shows a list of all jobs in a certain category.
  const { jobsList, jobString } = props;

  if (typeof jobsList == "undefined") {
    //We're still waiting on the data from the backend, so we
    //display a loading spinner.
    return (
      <div className="flex flex-col items-center justify-center py-5">
        <Image
          src="/icons/ring-resize.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (Object.keys(jobsList).length === 0) {
    //This is shown if there are no jobs in the job list.
    return (
      <p className="mb-1 box-border rounded-xl bg-white p-4 text-center text-xl shadow-lg dark:bg-background_secondary_dark">
        There are currently no {jobString} to display here.
      </p>
    );
  }

  //If we have jobs in the list, we sort them by their starting time and
  //show them to the user.
  return (
    <ul>
      {Object.entries(jobsList)
        .sort((a, b) => b[1].EpochStarted - a[1].EpochStarted)
        .map(([jobId, job]) => (
          <JobOverviewItem key={jobId} job={job} jobId={jobId} />
        ))}
    </ul>
  );
}

export default JobOverviewList;
