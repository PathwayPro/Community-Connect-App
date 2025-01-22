import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { FileValidationEnum } from './util/files-validation.enum';
import { UploadedFile } from './util/uploaded-file.interface';
import { FileValidations } from './util/file-validations.interface';


@Injectable()
export class FilesService {

  constructor(private readonly configService: ConfigService) {
    const commonImageTypes: string[] = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
    const commonDocumentTypes: string[] = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // (Microsoft Word documents)
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // (Microsoft PowerPoint presentations)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // (Microsoft Excel spreadsheets)
      'text/plain'
    ];
    const commonVideoTypes: string[] = ['video/mp4', 'video/webm'];

    this.fileValidations = {
      'PROFILE_PICTURE': {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 2 * 1024 * 1024 // 2MB
      },
      'EVENTS': {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 10 * 1024 * 1024 // 10MB
      },
      'NEWS': {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 5 * 1024 * 1024 // 5MB
      },
      'RESOURCES': {
        allowedMimeTypes: [...commonImageTypes, ...commonVideoTypes, ...commonDocumentTypes],
        maxSizeInBytes: 20 * 1024 * 1024 // 10MB
      }
    };
   }

   private fileValidations: Record<FileValidationEnum, FileValidations>;

  private fileDirectory(validation: FileValidationEnum): string {
    const publicDir = this.configService.get<string>('UPLOAD_DIR_ROOT')
    switch (validation) {
      case "PROFILE_PICTURE":
        return publicDir + '/' + this.configService.get<string>('UPLOAD_DIR_PROFILE_PICTURE');
      case "RESOURCES":
        return publicDir + '/' + this.configService.get<string>('UPLOAD_DIR_RESOURCES');
      case "EVENTS":
        return publicDir + '/' + this.configService.get<string>('UPLOAD_DIR_EVENTS');
      case "NEWS":
        return publicDir + '/' + this.configService.get<string>('UPLOAD_DIR_NEWS');
      default:
        throw new BadRequestException('You must specify a valid use fir this file.');
    }
  }

  

  async upload(validation: FileValidationEnum, file: Express.Multer.File): Promise<UploadedFile> {
    try {
      // // VALIDATE FILE
      const { allowedMimeTypes, maxSizeInBytes } = this.fileValidations[validation]; 

      if (!allowedMimeTypes.includes(file.mimetype)) {
        console.log('FILE MIMETYPE:', file.mimetype)
        throw new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
      }

      if (file.size > maxSizeInBytes) {
        throw new BadRequestException(`File size exceeds the limit of ${maxSizeInBytes / (1024 * 1024)} MB.`);
      }

      // DEFINE DIRECTORY FOR THE FILE ACCORDING TO ITS USAGE
      const uploadDir = this.fileDirectory(validation);

      // CREATE DIRECTORIES IF DON'T EXIST
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // UUID FOR THE FILE TO PREVENT UNINTENTIONAL DELETIONS
      const fileName = `${uuid.v4()}-${path.basename(file.originalname)}`;
      const filePath = path.join(uploadDir, fileName);

      // UPLOAD FILE
      fs.writeFileSync(filePath, file.buffer);

      // VERIFY UPLOADED FILE
      const fileUploaded = fs.existsSync(filePath);
      if (!fileUploaded) {
        throw new InternalServerErrorException('There was an error uploading your file. Please try agein later.')
      }

      return { fileName, path: uploadDir };
      
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
