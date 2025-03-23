import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/forget-password": {};
  "/merchant/store-management": {};
  "/merchant/dashboard": {};
  "/merchant/queue": {};
  "/queue-complete/:queueId": {
    "queueId": string;
  };
  "/queue/:queueId": {
    "queueId": string;
  };
  "/shop/:shopID": {
    "shopID": string;
  };
  "/profile": {};
  "/scan": {};
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/logout": {};
  "/login": {};
  "/test": {};
  "/homepage": {};
  "/map": {};
};