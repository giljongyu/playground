import { Counter, Histogram } from '@opentelemetry/api';
import { useContext, useEffect, useState } from 'react';
import { TelemetryContext } from '../contexts';

export const useMetric = () => {
  const [simpleCounter, setCounter] = useState<Counter>();
  const [pageLoadHistogram, setPageLoadHistogram] = useState<Histogram>();

  const { enabled, meterProvider } = useContext(TelemetryContext)

  useEffect(() => {
    if (!enabled || !meterProvider) {
      return
    }

    const meter = meterProvider.getMeter('meter');
    setCounter(meter.createCounter('simple_counter'));
    setPageLoadHistogram(meter.createHistogram('page_load_time_milliseconds'));
  }, [meterProvider]);

  return {
    counter: simpleCounter,
    pageLoadHistogram,
  };
};
