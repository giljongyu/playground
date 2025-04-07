import { useCallback } from "react";

import { useEffect, useRef } from "react";
import * as Comlink from "comlink";
import { PdfLibWorker } from "./pdflib.worker";

export const usePdfLib = () => {
  const workerRef = useRef<Comlink.Remote<PdfLibWorker> | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./pdflib.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = Comlink.wrap<PdfLibWorker>(worker);
    console.log("PDF 워커 초기화 완료", workerRef.current);
    return () => {
      worker.terminate();
    };
  }, []);

  const loadPdf = useCallback(
    async (...props: Parameters<PdfLibWorker["hello"]>) => {
      if (!workerRef.current) {
        console.error("PDF 워커가 초기화되지 않았습니다.");
        return null;
      }

      try {
        console.log("PDF 처리 시작", props);
        const result = await workerRef.current.hello(...props);
        console.log("PDF 처리 완료", result);
        return result;
      } catch (error) {
        console.error("PDF 처리 중 오류 발생:", error);
        throw error;
      }
    },
    []
  );

  return { loadPdf };
};
