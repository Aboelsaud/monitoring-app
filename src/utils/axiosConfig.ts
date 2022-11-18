const axios = require('axios');

export const startReqConfig = async (user_email: string) => {
  axios.interceptors.request.use((config: any) => {
    config.headers['startTime'] = process.hrtime();
    config.headers['user_email'] = user_email;
    return config;
  });

  axios.interceptors.response.use((response) => {
    const start: any = response.config.headers['startTime'];
    const endTime = process.hrtime(start);
    const milliseconds = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
    response.headers['duration'] = milliseconds.toString();
    response.headers['user_email'] = response.config.headers['user_email'];
    response.headers.status = response.status.toString();
    return response;
  });
};
