import { startReqConfig } from './axiosConfig';
import https from 'https';
import axios from 'axios';
import { sendEmail } from './sendEmail';
import { SuccessResponse } from './successResponse';
import { FailureResponse } from './failureResponse';

const getOptions = (checkData) => {
  const { timeout, authentication, httpHeaders, ignoreSSL } = checkData;
  let options = {
    headers: httpHeaders,
    timeout: timeout * 1000,
  };
  if (authentication) {
    options['auth'] = {
      username: authentication.username,
      password: authentication.password,
    };
  }
  return options;
};

const CheckURLs = async (url, options, checkData, reportData) => {
  const response = await axios.get(url, options);
  if (response.status == 200) {
    const sucessReportData = SuccessResponse();
    // update report data here
  } else {
    const failureReportData = FailureResponse();
    // update report data here

    //sendEmail(`server with check ${checkData.name} has been down`, '');
  }
};

export const startInterval = async (check, report) => {
  startReqConfig();
  console.log(check);
  let interval = setInterval(async () => {
    try {
      let { url } = check;
      const options = getOptions(check);
      //await CheckURLs(url, options, check, report);
    } catch (error) {
      console.log(error);
    }
  }, check.interval * 1000);

  return interval;
};
