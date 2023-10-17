import Link from "next/link";

import ProgressBar from "../progress-bar";

function JobOverviewItem(props) {
  //This component shows a small overview box with basic information
  //regarding the job. It is used on the homepage. It will only be
  //used when we know we have data to display, so we don't have to
  //do many checks here.
  const {
    User,
    Name,
    CompletedChunks,
    QueuedChunks,
    SuspendedChunks,
    RenderingChunks,
    FailedChunks,
    PendingChunks,
    Errs,
  } = props.job;

  const { jobId } = props;

  const totalChunks =
    CompletedChunks +
    QueuedChunks +
    SuspendedChunks +
    RenderingChunks +
    FailedChunks +
    PendingChunks;

  //Little if check here to prevent an almost complete job from
  //rounding to 100%.
  var completedPercentage = (CompletedChunks / totalChunks) * 100;
  if (completedPercentage > 99 && completedPercentage != 100) {
    completedPercentage = 99;
  } else {
    completedPercentage = Math.round(completedPercentage);
  }

  return (
    <Link href={`/${jobId}`}>
      <div className="mb-1 box-border transform rounded-xl bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-background_secondary_dark">
        <ProgressBar
          completedChunks={CompletedChunks}
          renderingChunks={RenderingChunks}
          failedChunks={FailedChunks}
          errs={Errs}
          totalChunks={totalChunks}
        />
        <div className="flex flex-row justify-start pt-1 ">
          <div className="justify-self-start overflow-auto">
            <p className="break-all pb-1 text-left text-lg font-bold md:text-xl">
              {User}
            </p>
            <p className="break-all pr-10 text-lg italic">
              {Name.replace(/\//g, "∕")}
            </p>
          </div>

          <div className="ml-auto self-center">
            <p className="text-md font-bold md:text-2xl">
              {completedPercentage}%
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default JobOverviewItem;
