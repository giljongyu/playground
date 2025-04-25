import { trace, Tracer } from "@opentelemetry/api";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import * as React from "react";
import { initMetric } from "./metric";
import { initTracer } from "./tracer";
import { PropsWithChildren, useEffect, useRef } from "react";
import { usePreservedCallback } from "react-simplikit";

type TelemetryContextState = {
  meterProvider: MeterProvider;
  getTracer: () => null | Tracer;
  enabled: boolean;
};

export const TelemetryContext =
  React.createContext<TelemetryContextState | null>(null);

type TelemetryProviderParams = {
  resourceName?: string;
  resourceVersion?: string;
  metricExporterEndpoint?: string;
  traceExporterEndpoint?: string;
  enabled?: boolean;
  isDev?: boolean;
};

export const TelemetryProvider = ({
  children,
  resourceName: _resourceName,
  resourceVersion: _resourceVersion,
  metricExporterEndpoint: _metricExporterEndpoint,
  traceExporterEndpoint: _traceExporterEndpoint,
  enabled = true,
  isDev = false,
}: PropsWithChildren<TelemetryProviderParams>) => {
  const [loaded, setLoaded] = React.useState(false);
  const tracerProvider = useRef<WebTracerProvider>(null);
  const meterProvider = useRef<MeterProvider>(null);

  const resourceName = _resourceName ?? "unknown";
  const resourceVersion = _resourceVersion ?? "0.1.0";
  const traceExporterEndpoint =
    _traceExporterEndpoint ?? "http://127.0.0.1:8318/v1/traces";
  const metricExporterEndpoint =
    _metricExporterEndpoint ?? "http://127.0.0.1:8318/v1/metrics";
  const consoleExporterEnabled = isDev;

  const preservedInitTraceAndMetric = usePreservedCallback(() => {
    const _tracerProvider = initTracer({
      resourceName,
      resourceVersion,
      traceExporterEndpoint,
      consoleExporterEnabled,
    });
    tracerProvider.current = _tracerProvider;

    const _meterProvider = initMetric({
      resourceName,
      resourceVersion,
      metricExporterEndpoint,
      consoleExporterEnabled,
    });
    meterProvider.current = _meterProvider;

    setLoaded(true);
  });

  useEffect(() => {
    if (loaded || !enabled) {
      return () => {};
    }

    preservedInitTraceAndMetric();
  }, [enabled, loaded, preservedInitTraceAndMetric]);

  const getTracer = usePreservedCallback(() => {
    if (!loaded || !enabled) {
      return null;
    }

    return trace.getTracer(resourceName, resourceVersion);
  });

  return (
    <TelemetryContext.Provider
      value={{
        meterProvider: meterProvider.current!,
        getTracer,
        enabled,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
