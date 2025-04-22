/* eslint-disable @typescript-eslint/no-explicit-any */
import { trace, TracerProvider } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { resourceFromAttributes } from "@opentelemetry/resources";

import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

let tracerInitialized = false;
let _resourceName = "unknown";
let _resourceVersion = "0.1.0";

export const initTracer = ({
  resourceName,
  resourceVersion,
  traceExporterEndpoint,
  traceExporterHeaders,
  consoleExporterEnabled,
}: {
  resourceName: string;
  resourceVersion: string;
  traceExporterEndpoint: string;
  traceExporterHeaders?: Record<string, any>;
  consoleExporterEnabled: boolean;
}) => {
  const consoleExporter = new ConsoleSpanExporter();
  const collectorExporter = new OTLPTraceExporter({
    url: traceExporterEndpoint ?? "http://localhost:4318/v1/traces",
    headers: traceExporterHeaders ?? {},
  });

  const spanProcessors = [new SimpleSpanProcessor(collectorExporter)];
  if (consoleExporterEnabled)
    spanProcessors.push(new SimpleSpanProcessor(consoleExporter));

  _resourceName = resourceName ?? "unknown";
  _resourceVersion = resourceVersion ?? "0.1.0";

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: _resourceName,
    [ATTR_SERVICE_VERSION]: _resourceVersion,
  });

  const provider = new WebTracerProvider({
    resource: resource,
    spanProcessors,
  });

  const fetchInstrumentation = new FetchInstrumentation({});
  fetchInstrumentation.setTracerProvider(provider as unknown as TracerProvider);

  provider.register();

  tracerInitialized = true;

  return provider;
};

export const getTracer = () => {
  if (!tracerInitialized) {
    return null;
  }

  return trace.getTracer(_resourceName, _resourceVersion);
};
