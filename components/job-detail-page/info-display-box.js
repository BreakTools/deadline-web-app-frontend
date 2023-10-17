function InfoDisplayBox(props) {
  //This component is a small box that we can color and display some data in,
  //it is used in the job details page.
  const { color, text, value } = props;

  return (
    <div
      className={`${color} my-2  w-full rounded-xl px-4 py-1 shadow-lg md:my-0 md:w-auto md:py-4 `}
    >
      <p className="md:text-md text-left text-lg  ">{text}</p>
      <p className="text-right text-2xl font-bold md:text-2xl ">{value}</p>
    </div>
  );
}

export default InfoDisplayBox;
