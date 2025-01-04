import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('upload')
  // @ResponseMessage('Upload a file')
  // @UseInterceptors(FileInterceptor('file')) //file: tên trường cần truyền có thể thay đổi
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /^(image\/png|image\/jpeg|image\/gif|application\/pdf)$/i,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1024 * 1024 * 5, //kb = 5MB,
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //         exceptionFactory: (errors) => {
  //           console.log('errors: ', errors);
  //           return new BadRequestException(
  //             'File không hợp lệ. Chỉ chấp nhận định dạng PNG, JPEG, GIF, hoặc PDF.',
  //           );
  //         },
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   console.log('file11: ', file);
  //   return { fileName: file.filename };
  // }

  // @Post('upload-multiple')
  // @ResponseMessage('Upload multiple files')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     // 'files': tên trường upload, 10: giới hạn số file
  //     limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn mỗi file 5MB
  //     fileFilter: (req, file, cb) => {
  //       const validMimeTypes = [
  //         'image/png',
  //         'image/jpeg',
  //         'image/gif',
  //         'application/pdf',
  //       ];
  //       if (!validMimeTypes.includes(file.mimetype)) {
  //         return cb(new BadRequestException('Invalid file type.'), false);
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // uploadMultipleFiles(
  //   @UploadedFiles(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /^(image\/png|image\/jpeg|image\/gif|application\/pdf)$/i,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1024 * 1024 * 5, //kb = 5MB
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //         exceptionFactory: (errors) => {
  //           console.log('errors: ', errors);
  //           return new BadRequestException(
  //             'One or more files are invalid. Only PNG, JPEG, GIF, or PDF formats are accepted.',
  //           );
  //         },
  //       }),
  //   )
  //   files: Express.Multer.File[],
  // ) {
  //   console.log('files: ', files);
  //   return files.map((file) => ({
  //     fileName: file.filename,
  //     originalName: file.originalname,
  //   }));
  // }

  @Post('upload')
  @ResponseMessage('Upload files')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB mỗi file
      fileFilter: (req, file, cb) => {
        const validMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/gif',
          'application/pdf',
        ];
        if (!validMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type.'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/png|image\/jpeg|image\/gif|application\/pdf)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: (errors) => {
            console.log('errors: ', errors);
            return new BadRequestException(
              'One or more files are invalid. Only PNG, JPEG, GIF, or PDF formats are accepted.',
            );
          },
        }),
    )
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    if (files.length === 1) {
      // Xử lý upload 1 file
      console.log('Single file uploaded:', files[0]);
      return {
        fileName: files[0].filename,
      };
    }

    // Xử lý upload nhiều file
    console.log('Multiple files uploaded:', files);
    return {
      message: 'Multiple files uploaded successfully',
      files: files.map((file) => ({
        fileName: file.filename,
        originalName: file.originalname,
      })),
    };
  }

  @Get('upload2')
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
