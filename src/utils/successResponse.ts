export const SuccessResponse = (report, check, response) => {
  let details: any = {};
  const { status, headers } = response;
  const { uptime, responseTime } = report;
  const { interval } = check;
  const duration = (Number(headers['duration']) / 1000).toFixed(2);
  details.status = status;
  details.uptime = uptime + interval;
  details.responseTime = duration.toString();
  return details;
};
