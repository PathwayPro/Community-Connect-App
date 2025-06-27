import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    const commonImageTypes: string[] = [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/webp',
    ];
    const commonDocumentTypes: string[] = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // (Microsoft Word documents)
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // (Microsoft PowerPoint presentations)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // (Microsoft Excel spreadsheets)
      'text/plain',
    ];
    const commonVideoTypes: string[] = ['video/mp4', 'video/webm'];
    const commonResumesTypes: string[] = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // (Microsoft Word documents)
      'text/plain',
    ];

    this.fileValidations = {
      PROFILE_PICTURE: {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 2 * 1024 * 1024, // 2MB
      },
      EVENTS: {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 10 * 1024 * 1024, // 10MB
      },
      NEWS: {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 5 * 1024 * 1024, // 5MB
      },
      RESOURCES: {
        allowedMimeTypes: [
          ...commonImageTypes,
          ...commonVideoTypes,
          ...commonDocumentTypes,
        ],
        maxSizeInBytes: 20 * 1024 * 1024, // 10MB
      },
      RESUME: {
        allowedMimeTypes: commonResumesTypes,
        maxSizeInBytes: 10 * 1024 * 1024, // 10MB
      },
      POST: {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 2 * 1024 * 1024, // 2MB
      },
      LOGO: {
        allowedMimeTypes: commonImageTypes,
        maxSizeInBytes: 2 * 1024 * 1024, // 2MB
      },
    };
  }

  private fileValidations: Record<FileValidationEnum, FileValidations>;

  private fileDirectory(validation: FileValidationEnum): string {
    switch (validation) {
      case 'PROFILE_PICTURE':
        return this.configService.get<string>('UPLOAD_DIR_PROFILE_PICTURE');
      case 'RESOURCES':
        return this.configService.get<string>('UPLOAD_DIR_RESOURCES');
      case 'EVENTS':
        return this.configService.get<string>('UPLOAD_DIR_EVENTS');
      case 'NEWS':
        return this.configService.get<string>('UPLOAD_DIR_NEWS');
      case 'RESUME':
        return this.configService.get<string>('UPLOAD_DIR_RESUME');
      case 'POST':
        return this.configService.get<string>('UPLOAD_DIR_POST');
      case 'LOGO':
        return this.configService.get<string>('UPLOAD_DIR_LOGO');
      default:
        throw new BadRequestException(
          'You must specify a valid use for this file.',
        );
    }
  }

  async upload(
    validation: FileValidationEnum,
    file: Express.Multer.File,
  ): Promise<UploadedFile> {
    try {
      // // VALIDATE FILE
      const { allowedMimeTypes, maxSizeInBytes } =
        this.fileValidations[validation];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        console.log('FILE MIMETYPE:', file.mimetype);
        throw new BadRequestException(
          `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
        );
      }

      if (file.size > maxSizeInBytes) {
        throw new BadRequestException(
          `File size exceeds the limit of ${maxSizeInBytes / (1024 * 1024)} MB.`,
        );
      }

      // DEFINE DIRECTORY FOR THE FILE ACCORDING TO ITS USAGE
      const publicDir = this.configService.get<string>('UPLOAD_DIR_ROOT');
      const fileTypeDirectory = this.fileDirectory(validation);
      const uploadDir = publicDir + '/' + fileTypeDirectory;

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
        throw new InternalServerErrorException(
          'There was an error uploading your file. Please try agein later.',
        );
      }

      return { fileName, path: fileTypeDirectory };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (!filePath) {
        return false;
      }

      const publicDir = this.configService.get<string>('UPLOAD_DIR_ROOT');
      const fullPath = path.join(publicDir, filePath);

      // Check if file exists before attempting to delete
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`File deleted successfully: ${fullPath}`);
        return true;
      } else {
        console.log(`File not found for deletion: ${fullPath}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }

  async deleteFiles(
    filePaths: string[],
  ): Promise<{ success: boolean; deleted: string[]; failed: string[] }> {
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const filePath of filePaths) {
      try {
        const success = await this.deleteFile(filePath);
        if (success) {
          deleted.push(filePath);
        } else {
          failed.push(filePath);
        }
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        failed.push(filePath);
      }
    }

    return {
      success: failed.length === 0,
      deleted,
      failed,
    };
  }
}
