import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { startInterval } from '../utils/pollingProcess';

@Injectable()
export class eventEmitter {
  @OnEvent('createCheck', { async: true })
  handleOrderCreatedEvent(payload: any) {
    console.log('payload event emitter', payload);
    const check = payload.savedCheck;
    const report = payload.savedReport;
    let interval = startInterval(check, report);
  }
}
