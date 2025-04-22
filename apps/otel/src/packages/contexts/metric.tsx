// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
  PushMetricExporter,
} from "@opentelemetry/sdk-metrics";

let _meterProvider: MeterProvider;
let _metricInitialized = false;
let _resourceName = "unknown";
let _resourceVersion = "0.1.0";

export type MetricParams = {
  resourceName: string;
  resourceVersion: string;
  metricExporterEndpoint?: string;
  exportIntervalMillis?: number;
  consoleExporterEnabled?: boolean;
};

export const initMetric = ({
  metricExporterEndpoint,
  resourceName,
  resourceVersion,
  exportIntervalMillis = 10,
  consoleExporterEnabled = false,
}: MetricParams): MeterProvider => {
  const exporter = new OTLPMetricExporter({
    url: metricExporterEndpoint ?? "http://127.0.0.1:4318/v1/metrics",
    concurrencyLimit: 1,
  });

  _resourceName = resourceName ?? "unknown";
  _resourceVersion = resourceVersion ?? "0.1.0";

  const readers = [
    new PeriodicExportingMetricReader({
      exporter: exporter as unknown as PushMetricExporter,
      exportIntervalMillis: exportIntervalMillis * 1000,
    }),
  ];
  if (consoleExporterEnabled) {
    readers.push(
      new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
        exportIntervalMillis: exportIntervalMillis * 1000,
      })
    );
  }

  const meterProvider = new MeterProvider({ readers });

  _meterProvider = meterProvider;
  _metricInitialized = true;

  return meterProvider;
};

export const getMeter = () => {
  if (!_metricInitialized) {
    return null;
  }

  return _meterProvider.getMeter(_resourceName, _resourceVersion);
};
