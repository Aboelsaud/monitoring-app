import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PollingService } from '../polling/polling.service';

@Injectable()
export class EventEmitterService {
  constructor(private pollingService: PollingService) {}
  @OnEvent('createCheck', { async: true })
  handleOrderCreatedEvent(payload: any) {
    console.log('payload event emitter', payload);
    const check = payload.savedCheck;
    let interval = this.pollingService.startInterval(check, payload.user_email);
  }
}
