import { useContext } from "react";
import { TelemetryContext } from "../contexts";

export const useTracer = () => {
  const result = useContext(TelemetryContext);

  if (!result) {
    throw Error("helloworld");
  }

  return result;
};
