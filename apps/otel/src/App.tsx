import { useTracer, withPageLoadMetric } from "./packages/index.tsx";
import { SpanStatusCode } from "@opentelemetry/api";

const App = withPageLoadMetric("App", () => {
  const getter = useTracer();

  const handleClick = () => {
    const tracer = getter.getTracer();
    if (!tracer) {
      throw Error("helloworld");
    }

    tracer.startActiveSpan("button-click", (span) => {
      try {
        // TODO: 실제 버튼 클릭 시 수행할 작업
        console.log("버튼이 클릭되었습니다.");
        span.setAttribute("button", "clicked");
        span.setStatus({ code: SpanStatusCode.OK });
      } catch (err: unknown) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err instanceof Error ? err.message : "unknown error",
        });
        throw err;
      } finally {
        span.end();
      }
    });
  };
  return (
    <>
      <button onClick={handleClick}>클릭하면?</button>
    </>
  );
});

export default App;
