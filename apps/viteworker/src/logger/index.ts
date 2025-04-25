const API_ENDPOINT = "https://ec.payhere.dev/";

interface EventRequestParam {
  identifier: string;
  data: string;
  event_category: string;
  timestamp: string;
}

type SuccessResponse204 = void;

type ErrorResponse400 = {
  meta: {
    code: string;
    type: string;
    message: string;
  };
  data: null;
};

interface CreateEventLogContextParam {
  headers: {
    "Payhere-Client-Application": string;
    "Payhere-Client-Platform": string;
    "Payhere-Client-Version": string;
    "Payhere-Client-Stage": string;
  };
  endPointUrl?: string;
  
}

const createEventLogContext = () => {};

const postEventLog = async () => {
  return fetch(`${API_ENDPOINT}api/v1/event`, {
    method: "POST",
    headers: {
      "Payhere-Client-Application": "poc-test",
      "Payhere-Client-Platform": "PC",
      "Payhere-Client-Version": "1.0.0",
      "Payhere-Client-Stage": "dev",
    },
  });
};
