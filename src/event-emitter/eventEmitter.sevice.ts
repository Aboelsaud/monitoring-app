import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PollingService } from '../polling/polling.service';

let intervals = [];
@Injectable()
export class EventEmitterService {
  constructor(private pollingService: PollingService) {}

  @OnEvent('createCheck', { async: true })
  handleCheckCreatedEvent(payload: any) {
    const check = payload.savedCheck;
    let interval = this.pollingService.startInterval(check, payload.user_email);
    intervals.push({
      checkId: check.id,
      userId: check.userId,
      interval: interval,
    });
  }

  @OnEvent('updateCheck')
  async handleCheckUpdatedEvent(payload: any) {
    const check = payload.updatedCheck;
    let checkInterval: any = intervals.find(
      (interval) => interval.checkId == check.id,
    );
    clearInterval(await checkInterval.interval);
    let interval = this.pollingService.startInterval(check, payload.user_email);
    intervals.map((i) => (i.checkId == check.id ? (i.interval = interval) : i));
  }

  @OnEvent('deleteCheck')
  async handleCheckDeletedEvent(id: string) {
    const checkId = id;
    let checkInterval: any = intervals.find(
      (interval) => interval.checkId == checkId,
    );
    clearInterval(await checkInterval.interval);
    intervals.splice(
      intervals.indexOf((e) => e.checkId == checkId),
      1,
    );
  }
}
