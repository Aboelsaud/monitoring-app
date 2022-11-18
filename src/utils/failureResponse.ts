export const FailureResponse = (report, check, status) => {
  let details: any = {};
  const { outages, downtime } = report;
  const { interval } = check;
  details.status = status;
  details.outages = outages + 1;
  details.downtime = downtime + interval;

  return details;
};
