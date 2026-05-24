import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../utils/response';
import type { IssueFilters, JwtPayload } from '../../utils/types';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateIssueDto, @CurrentUser() user: JwtPayload) {
    const issue = await this.issuesService.create(dto, user.id);
    return successResponse('Issue created successfully', issue);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: IssueFilters) {
    const issues = await this.issuesService.findAll(query);
    return successResponse('Issues retrived successfully', issues);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.issuesService.findOne(id);
    return successResponse('Issue retrived successfully', issue);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const issue = await this.issuesService.update(id, dto, user);
    return successResponse('Issue updated successfully', issue);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('maintainer')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.issuesService.remove(id);
    return successResponse('Issue deleted successfully');
  }
}
