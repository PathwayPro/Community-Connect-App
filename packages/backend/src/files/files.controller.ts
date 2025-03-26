/*
import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Roles, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { FileValidationEnum } from './util/files-validation.enum';
import { Response } from 'express';
import * as path from 'path';
*/
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import { FileValidationEnum } from './util/files-validation.enum';
import { Response } from 'express';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService /*private readonly filesService: FilesService*/,
  ) {}

  @Public()
  @Get(':filetype/:filename')
  @ApiOkResponse({
    description: 'File content',
    content: {
      'application/octet-stream': {
        // Or the specific content type (e.g., image/jpeg, application/pdf)
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Get file',
    description: `
      \n\n Returns a file according to its type and name. 
      \n\n REQUIRED ROLES: **PUBLIC** 
      \n\n Files are stored in the DB with the format \`type/name\`
  `,
  })
  @ApiParam({ name: 'filetype' })
  @ApiParam({ name: 'filename' })
  async getFile(
    @Param('filetype') type: FileValidationEnum,
    @Param('filename') name: string,
    @Res() res: Response,
  ) {
    const root = this.configService.get<string>('UPLOAD_DIR_ROOT');
    const filePath = path.join(type, name);
    return res.sendFile(filePath, { root });
  }

  /*
  @Roles('ADMIN', 'MENTOR', 'USER')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/profile-picture')
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(FileValidationEnum.PROFILE_PICTURE, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/resources')
  uploadResources(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(FileValidationEnum.RESOURCES, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/events')
  uploadEvents(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(FileValidationEnum.EVENTS, file);
  }

  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/news')
  uploadNews(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(FileValidationEnum.NEWS, file);
  }
*/
}
