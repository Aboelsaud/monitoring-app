export const FailureResponse = (report, check, status) => {
  let details: any = {};
  const { outages, downtime } = report;
  details.status = status;
  details.outages = outages + 1;
  details.downtime = downtime + 1;
  details.availability = (details.uptime / (details.uptime + downtime)) * 100;

  return details;
};
