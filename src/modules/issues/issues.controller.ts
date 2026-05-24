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
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../utils/response';
import type { JwtPayload } from '../../utils/types';
import { CreateIssueDto } from './dto/create-issue.dto';
import { GetIssuesQueryDto } from './dto/get-issues-query.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesService } from './issues.service';

@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Create a new issue (authenticated)' })
  @ApiResponse({ status: 201, description: 'Issue created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  async create(@Body() dto: CreateIssueDto, @CurrentUser() user: JwtPayload) {
    const issue = await this.issuesService.create(dto, user.id);
    return successResponse('Issue created successfully', issue);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all issues (public, filterable)' })
  @ApiResponse({ status: 200, description: 'Issues retrieved successfully' })
  async findAll(@Query() query: GetIssuesQueryDto) {
    const issues = await this.issuesService.findAll(query);
    return successResponse('Issues retrived successfully', issues);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single issue by ID (public)' })
  @ApiResponse({ status: 200, description: 'Issue retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.issuesService.findOne(id);
    return successResponse('Issue retrived successfully', issue);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiSecurity('token')
  @ApiOperation({
    summary:
      'Update an issue (authenticated; contributors own open issues only)',
  })
  @ApiResponse({ status: 200, description: 'Issue updated successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
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
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Delete an issue (maintainer only)' })
  @ApiResponse({ status: 200, description: 'Issue deleted successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Maintainer role required' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.issuesService.remove(id);
    return successResponse('Issue deleted successfully');
  }
}
