import TaskOverviewItem from "./task-details";

function TasksListBox(props) {
  //This component shows a list of all tasks in a job.
  //A typical task would be rendering a frame, thus this
  //list could be rather long so we cap the length at full
  //screen height.
  const { tasks, jobId } = props;

  return (
    <div className="h-screen items-center px-4 pb-10 pt-10 text-right font-jost  md:mx-auto md:w-3/4 md:px-0 lg:w-1/2 ">
      <div className="align-self-center mx-auto box-border h-full overflow-y-auto rounded-xl bg-white pt-10 text-left shadow-lg dark:bg-background_secondary_dark">
        <ul>
          {Object.keys(tasks).map((task) => (
            <TaskOverviewItem
              key={task}
              task={tasks[task]}
              jobId={jobId}
              taskId={task}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TasksListBox;
