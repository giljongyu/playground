import React, { Profiler, useContext } from "react";
import { useMetric } from "../hooks/useMetric";
import { TelemetryContext } from "../contexts";

export const withPageLoadMetric = (
  pageId: string,
  Component: React.ComponentType
) => {
  return () => {
    const result = useContext(TelemetryContext);
    if (!result) {
      throw Error("helloworld");
    }

    const { enabled } = result;

    if (!enabled) {
      return <Component />;
    }

    const { pageLoadHistogram } = useMetric();
    return (
      <Profiler
        id={pageId}
        onRender={(
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime
        ) => {
          console.log("pageLoadHistogram.record", id, phase, commitTime);
          pageLoadHistogram?.record(actualDuration, { page_id: id, phase });
        }}
      >
        <Component />
      </Profiler>
    );
  };
};
