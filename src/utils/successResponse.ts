export const SuccessResponse = (report, check, response) => {
  console.log('successeeeee');
  let details: any = {};
  const { status, headers } = response;
  const { uptime, responseTime } = report;
  const { interval } = check;
  details.status = status;
  details.uptime = uptime + interval;
  details.responseTime = (responseTime + headers['duration']) / 2;
  console.log(details);
};
