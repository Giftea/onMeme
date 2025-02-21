import { Oval } from "react-loader-spinner";

export default function IsLoading({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  return (
    <Oval
      visible={true}
      height={height || "120"}
      width={width || "120"}
      color="#ffffff"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass=""
      strokeWidth={4}
      secondaryColor="#ffffff70"
    />
  );
}
