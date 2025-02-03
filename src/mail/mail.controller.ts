import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schema/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Mails')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subcriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  test() {
    console.log('call me');
  }

  @Get()
  @Public()
  @ResponseMessage('Test email')
  @Cron('0 10 0 * * 0') // 0h10p am every Sunday
  async handleTestEmail() {
    const jobs = [
      {
        name: 'job reactjs',
        company: 'Công ty NMT',
        salary: '5000',
        skills: ['React', 'Node.js'],
      },
      {
        name: 'job reactjs22',
        company: 'Công ty NMT22',
        salary: '5000',
        skills: ['React2', 'Node.j2'],
      },
    ];

    const subscribes = await this.subcriberModel.find({});
    for (const subs of subscribes) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });

      if (jobWithMatchingSkills?.length > 0) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND',
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: 'nguyenmanhtien2002bl@gmail.com',
          from: '"Support Team" <support@example.com>',
          subject: 'Welcome to Nice App! Confirm your Email',
          // html: '<b>welcome bla bla</b>', // HTML body content
          template: 'job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
