import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  Issue,
  IssueFilters,
  IssueWithReporter,
  JwtPayload,
} from '../../utils/types';
import type { CreateIssueDto } from './dto/create-issue.dto';
import type { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesRepository } from './issues.repository';

@Injectable()
export class IssuesService {
  constructor(private readonly issuesRepository: IssuesRepository) {}

  async create(dto: CreateIssueDto, reporterId: number): Promise<Issue> {
    return this.issuesRepository.create(
      dto.title,
      dto.description,
      dto.type,
      reporterId,
    );
  }

  async findAll(filters: IssueFilters): Promise<IssueWithReporter[]> {
    const issues = await this.issuesRepository.findAll(filters);
    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
    const reporters =
      await this.issuesRepository.findReportersByIds(reporterIds);

    const reporterMap = new Map(reporters.map((r) => [r.id, r]));

    return issues.map(({ reporter_id, ...rest }) => ({
      ...rest,
      reporter: reporterMap.get(reporter_id) ?? {
        id: reporter_id,
        name: 'Unknown',
        role: 'contributor',
      },
    }));
  }

  async findOne(id: number): Promise<IssueWithReporter> {
    const issue = await this.issuesRepository.findById(id);
    if (!issue) {
      throw new NotFoundException(`Issue #${id} not found`);
    }

    const [reporter] = await this.issuesRepository.findReportersByIds([
      issue.reporter_id,
    ]);

    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporter ?? {
        id: reporter_id,
        name: 'Unknown',
        role: 'contributor',
      },
    };
  }

  async update(
    id: number,
    dto: UpdateIssueDto,
    requester: JwtPayload,
  ): Promise<Issue> {
    const issue = await this.issuesRepository.findById(id);
    if (!issue) {
      throw new NotFoundException(`Issue #${id} not found`);
    }

    if (requester.role === 'contributor') {
      if (issue.reporter_id !== requester.id) {
        throw new ForbiddenException('You can only edit your own issues');
      }
      if (issue.status !== 'open') {
        throw new ConflictException(
          'You can only edit issues that are still open',
        );
      }
    }

    const fields: Partial<{
      title: string;
      description: string;
      type: 'bug' | 'feature_request';
    }> = {};
    if (dto.title !== undefined) fields.title = dto.title;
    if (dto.description !== undefined) fields.description = dto.description;
    if (dto.type !== undefined) fields.type = dto.type;

    return this.issuesRepository.update(id, fields);
  }

  async remove(id: number): Promise<void> {
    const issue = await this.issuesRepository.findById(id);
    if (!issue) {
      throw new NotFoundException(`Issue #${id} not found`);
    }
    await this.issuesRepository.delete(id);
  }
}
