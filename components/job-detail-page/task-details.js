import Image from "next/image";
import { useContext, useState } from "react";

import WebsocketContext from "../../store/websocket-context";

function TaskOverviewItem(props) {
  //This components shows the details for a specific task, for example
  //a frame that is being rendered. It has a progress bar which you can
  //unfold to show an image preview of the frame being rendered.
  const { previewImages, sendMessage } = useContext(WebsocketContext);
  const [showTaskImage, setShowTaskImage] = useState(false);
  const { task, jobId, taskId } = props;

  const progress = task.Prog.replace(" %", "%");

  function get_task_preview() {
    //This function retrieves a preview jpeg in Base64 format from the backend.
    if (typeof previewImages[taskId] == "undefined") {
      sendMessage({ body: "get_image_preview", jobId: jobId, taskId: taskId });
      setShowTaskImage(true);
    } else {
      if (showTaskImage) {
        setShowTaskImage(false);
      } else {
        setShowTaskImage(true);
      }
    }
  }

  if (showTaskImage) {
    //If we have an image, we display it here. Sometimes retrieving an image fails,
    //in that case we display the error the backend sends us.
    var rotate = "rotate-180";
    if (typeof previewImages[taskId] != "undefined") {
      if (!previewImages[taskId].error) {
        //Our image is defined and we have no error, so we show the image.
        var detailDivToShow = (
          <Image
            src={`data:image/jpeg;base64,${previewImages[taskId].image}`}
            alt="Image preview"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="rounded-lg shadow-lg"
          />
        );
      } else {
        //Our image is defined but there is an error, so we show the error.
        var detailDivToShow = <p>{previewImages[taskId].message}</p>;
      }
    } else {
      //Our image is not defined, so we request it and show a loading spinner.
      var detailDivToShow = (
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
  } else {
    //If we're not showing an image we set these variable to nothing.
    var detailDivToShow = "";
    var rotate = "";
  }

  return (
    <div className="mb-3 px-8">
      <div
        className={`flex h-2 overflow-hidden rounded bg-background text-xs ${
          task.Errs > 0 ? "rounded-xl border-2 border-warning" : ""
        }`}
      >
        <div
          style={{ width: `${progress}` }}
          className="bg-teal-500 text-center"
        ></div>
      </div>

      <button onClick={get_task_preview} className="w-full">
        <div className="flex flex-row justify-between">
          <p>{task.Frames}</p>
          <Image
            src="icons/arrow-down-circle.svg"
            alt={`Show preview`}
            width={20}
            height={20}
            className={`${rotate} dark:invert`}
          />
        </div>
      </button>

      {detailDivToShow}
    </div>
  );
}

export default TaskOverviewItem;
