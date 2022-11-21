export const SuccessResponse = (report, check, response) => {
  let details: any = {};
  const { status, headers } = response;
  const { uptime, downtime } = report;
  const duration = (Number(headers['duration']) / 1000).toFixed(2);
  details.status = status;
  details.uptime = uptime + 1;
  details.responseTime = duration.toString();
  details.availability = (details.uptime / (details.uptime + downtime)) * 100;
  return details;
};
