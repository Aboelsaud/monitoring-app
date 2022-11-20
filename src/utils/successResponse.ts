export const SuccessResponse = (report, check, response) => {
  let details: any = {};
  const { status, headers } = response;
  const { uptime, downtime, responseTime } = report;
  const { interval } = check;
  const duration = (Number(headers['duration']) / 1000).toFixed(2);
  details.status = status;
  details.uptime = uptime + 1;
  details.responseTime = duration.toString();
  details.availability = uptime / (uptime + downtime);
  return details;
};
