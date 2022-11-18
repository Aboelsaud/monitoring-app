import { startReqConfig } from "./axiosConfig";
import https from 'https'

const getOptions = (checkData) => {
    const { timeout, authentication, httpHeaders, ignoreSSL } = checkData;
    let options = {
      headers: httpHeaders,
      timeout: timeout * 1000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: ignoreSSL,
      }),
    };
    if (authentication) {
      options['auth'] = {
        username: authentication.username,
        password: authentication.password,
      };
    }
    return options;
  }

export const pollingProcess = async (check) => {
    startReqConfig()
    let interval = setInterval(async () => {
      try {
        const checkData = await Check.findById(check._id);
        const reportData = await Report.findOne({ checkId: check._id });
        let { href } = checkData;
        const options = getOptions(checkData);
        await CheckURLs(href, options, checkData, reportData)
  
      } catch (error) {
        console.log(error)
      }
    }, (check.interval) * 1000);
  
    return interval;
  };