function ProgressBar(props) {
  //This component is a simple progress bar that shows how far our job is
  //based on the job chunk information. The progress bar will have an
  //orange outline if an error is present. It used both on the homepage
  //and the job details age.
  const { completedChunks, renderingChunks, failedChunks, errs, totalChunks } =
    props;

  const completedPercentage = Math.round((completedChunks / totalChunks) * 100);
  const renderingPercentage = Math.round((renderingChunks / totalChunks) * 100);
  const failedPercentage = Math.round((failedChunks / totalChunks) * 100);

  return (
    <div
      className={`relative ${
        errs > 0 ? "rounded-xl border-2 border-warning" : ""
      }`}
    >
      <div className="flex h-2 overflow-hidden rounded bg-background text-xs ">
        <div
          style={{ width: `${completedPercentage}%` }}
          className="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-white shadow-none"
        ></div>
        <div
          style={{ width: `${renderingPercentage}%` }}
          className="flex flex-col justify-center whitespace-nowrap bg-neutral text-center text-white shadow-none"
        ></div>
        <div
          style={{ width: `${failedPercentage}%` }}
          className="flex flex-col justify-center whitespace-nowrap bg-error text-center text-white shadow-none"
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
