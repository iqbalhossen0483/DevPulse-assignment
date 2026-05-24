import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IssuesController } from './issues.controller';
import { IssuesRepository } from './issues.repository';
import { IssuesService } from './issues.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, IssuesRepository, Reflector],
})
export class IssuesModule {}
