import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },  // ramp-up to 50 users
    { duration: '1m', target: 5 },   // stay at 50 users
    { duration: '30s', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
  },
};

export default function () {
  const res = http.get('https://criollo-list-app.vercel.app/categories');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1); // pacing between requests
}
