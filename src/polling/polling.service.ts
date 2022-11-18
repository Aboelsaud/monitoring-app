import { Injectable } from '@nestjs/common';
import { FailureResponse } from '../utils/failureResponse';
import { SuccessResponse } from '../utils/successResponse';
import { sendEmail } from '../utils/sendEmail';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { ReportService } from '../report/report.service';

const axios = require('axios');

@Injectable()
export class PollingService {
  constructor(
    private axiosConfigService: AxiosConfigService,
    private reportService: ReportService,
  ) {}
  private configs(checkData) {
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
  }

  private async startProcesss(url, options, checkData, reportData) {
    const response = await axios.get(url, options);
    if (response.status == 200) {
      console.log('response', response.headers);
      const sucessReportData = SuccessResponse(reportData, checkData, response);
      await this.reportService.updateReport(checkData.id, sucessReportData);
    } else {
      console.log('failure');
      const failureReportData = FailureResponse(
        reportData,
        checkData,
        response.status,
      );
      await this.reportService.updateReport(checkData.id, failureReportData);

      sendEmail(
        `server with check ${checkData.name} has been down`,
        response.headers.user_email,
      );
    }
  }

  async startInterval(check, user_email: string) {
    this.axiosConfigService.startReqConfig(user_email);
    console.log(check);
    let interval = setInterval(async () => {
      try {
        let { url } = check;
        const configs = this.configs(check);
        const report = await this.reportService.findOneByCheckId(check.checkId);
        await this.startProcesss(url, configs, check, report);
      } catch (error) {
        console.log(error);
      }
    }, check.interval * 1000);

    return interval;
  }
}
