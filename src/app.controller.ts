import { Controller, Get, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("sendEmail")
  sendEmail(@Payload() email: string){
    this.appService.sendEmail(email);
  }
}
