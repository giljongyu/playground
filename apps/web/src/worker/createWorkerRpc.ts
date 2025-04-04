/* eslint-disable no-restricted-globals */
type WorkerRpcSpec = Record<
  string,
  {
    request: any;
    response: any;
  }
>;

export type RequestMessage<T extends WorkerRpcSpec> = {
  id: string;
  type: keyof T;
  payload: T[keyof T]["request"];
};

export type SuccessResponse<T extends WorkerRpcSpec> = {
  id: string;
  type: keyof T;
  status: "success";
  payload: T[keyof T]["response"];
};

export type ErrorResponse<T extends WorkerRpcSpec> = {
  id: string;
  type: keyof T;
  status: "error";
  error: string;
};

export type CreateWorkerClientFunction<T extends WorkerRpcSpec> = {
  send: <K extends keyof T>(
    type: K,
    payload: T[K]["request"]
  ) => Promise<T[K]["response"]>;
  dispose: () => void;
};

export type CreateWorkerHandlerFunction<T extends WorkerRpcSpec> =
  (handlerMap: {
    [K in keyof T]: (
      payload: T[K]["request"]
    ) => SuccessResponse<T> | ErrorResponse<T>;
  }) => (e: MessageEvent) => void;

export function createWorkerRpc<TSpec extends WorkerRpcSpec>() {
  const createWorkerClient = (worker: Worker) => {
    const TIMEOUT_MS = 10_000;

    const pending = new Map<
      string,
      {
        resolve: (
          value: SuccessResponse<WorkerRpcSpec> | ErrorResponse<WorkerRpcSpec>
        ) => void;
        reject: (reason?: any) => void;
        timeoutId: ReturnType<typeof setTimeout>;
      }
    >();

    const handleMessage = (
      e: MessageEvent<
        SuccessResponse<WorkerRpcSpec> | ErrorResponse<WorkerRpcSpec>
      >
    ) => {
      const { id, status } = e.data;
      const request = pending.get(id);
      if (!request) return;

      clearTimeout(request.timeoutId);
      pending.delete(id);

      if (status === "error") {
        request.reject(
          new Error((e.data as ErrorResponse<WorkerRpcSpec>).error)
        );
      } else {
        request.resolve((e.data as SuccessResponse<WorkerRpcSpec>).payload);
      }
    };

    worker.addEventListener("message", handleMessage);

    const send = <K extends keyof TSpec>(
      type: K,
      payload: TSpec[K]["request"]
    ): Promise<TSpec[K]["response"]> => {
      const id = crypto.randomUUID();
      const message: RequestMessage<TSpec> = { id, type, payload };

      return new Promise((resolve, reject) => {
        console.log("send", message);
        const timeoutId = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Timeout for ${type as string}`));
        }, TIMEOUT_MS);

        pending.set(id, { resolve, reject, timeoutId });
        worker.postMessage(message);
      });
    };

    const dispose = () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      pending.forEach(({ reject, timeoutId }) => {
        clearTimeout(timeoutId);
        reject(new Error("WorkerClient disposed"));
      });
      pending.clear();
    };

    return { send, dispose } as CreateWorkerClientFunction<TSpec>;
  };

  const createWorkerHandler = (handlerMap: {
    [K in keyof TSpec]: (
      payload: TSpec[K]["request"],
      context: { id: string }
    ) => Promise<TSpec[K]["response"]>;
  }) => {
    return (e: MessageEvent<RequestMessage<TSpec>>) => {
      const { id, type, payload } = e.data;

      const handler = handlerMap[type as keyof TSpec];
      if (!handler) {
        self.postMessage({
          id,
          type,
          status: "error",
          error: `Unknown handler: ${type as string}`,
        });
        return;
      }

      Promise.resolve(handler(payload, { id }))
        .then((result) => {
          const response: SuccessResponse<TSpec> = {
            id,
            type,
            status: "success",
            payload: result,
          };
          self.postMessage(response);
        })
        .catch((err: any) => {
          const errorResponse: ErrorResponse<any> = {
            id,
            type,
            status: "error",
            error: err?.message || "Unknown error",
          };
          self.postMessage(errorResponse);
        });
    };
  };

  return {
    createWorkerClient,
    createWorkerHandler,
  };
}
