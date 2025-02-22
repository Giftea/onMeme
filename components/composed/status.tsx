import React from "react";
import { cn } from "@/lib/utils";
import { StatusMessage } from "@/lib/types/index";

type Props = {
  status: StatusMessage;
};

const Status = ({ status }: Props) => {
  return (
    <React.Fragment>
      {status.message && (
        <div
          className={cn("p-3 mt-6 rounded bg-blue-100 text-blue-700", {
            "bg-green-100 text-green-700": status.type === "success",
            "bg-red-100 text-red-700": status.type === "error",
          })}
        >
          {status.message}
        </div>
      )}
    </React.Fragment>
  );
};

export default Status;
