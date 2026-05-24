import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { IssuesModule } from './modules/issues/issues.module';

@Module({
  imports: [DatabaseModule, AuthModule, IssuesModule],
})
export class AppModule {}
