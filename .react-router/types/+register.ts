import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
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
  "/forget-password": {};
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/test": {};
  "/copy": {};
  "/homepage": {};
  "/map": {};
};