import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { CompaniesModule } from 'src/companies/companies.module';
import { Company, CompanySchema } from 'src/companies/schema/company.schema';
import { CompaniesService } from 'src/companies/companies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Job.name,
        schema: JobSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
    // MongooseModule.forFeature([
    //   {
    //     name: Company.name,
    //     schema: CompanySchema,
    //   },
    // ]),
  ],
  controllers: [JobsController],
  providers: [JobsService, CompaniesService],
  exports: [JobsService],
})
export class JobsModule {}
