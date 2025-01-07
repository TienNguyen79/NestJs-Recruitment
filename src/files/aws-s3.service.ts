import { Injectable, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { readFile } from 'fs/promises';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME; // Tên bucket trong S3
  fileRepository: any;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION, // Region của bucket
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access Key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Secret Key
      },
    });
  }

  async uploadFileS3(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileContent = await readFile(file.path); // gen ra dạng Buffer
    const fileKey = `${uuid()}-${file.originalname}`; // Tạo tên file duy nhất

    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileContent, // Dữ liệu file
      ContentType: file.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }
}
