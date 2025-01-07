import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  // func này trả ra đường link thư mục root
  getRootPath = () => {
    return process.cwd();
  };

  // kiểm tra thư mục đã tồn tại chưa
  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exists.');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          // Error:
          // Requested location already exists, but it's not a directory.
          break;
        case 'ENOTDIR':
          // Error:
          // The parent hierarchy contains a file with the same name as the dir
          // you're trying to create.
          break;
        default:
          // Some other error like permission denied.
          console.error(error);
          break;
      }
    });
  }
  createMulterOptions(): MulterModuleOptions {
    return {
      // lưu trữ trong ổ đĩa máy tính
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default'; // truyền lên header
          this.ensureExists(`public/images/${folder}`); // nếu chưa có thư mục bên trong public thì tạo nếu có rồi thì thôi
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        // có thể sửa tên file
        filename: (req, file, cb) => {
          //get image extension : png
          const extName = path.extname(file.originalname);
          //get image's name (without extension) img1
          const baseName = path.basename(file.originalname, extName);
          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
