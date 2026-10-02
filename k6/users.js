import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 10 },

    { duration: "10s", target: 50 },
    { duration: "20s", target: 50 },

    { duration: "10s", target: 100 },
    { duration: "20s", target: 100 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const page = Math.floor(Math.random() * 1000) + 1;

  const response = http.get(
    `http://localhost:3000/api/users?page=${page}&limit=20`
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}