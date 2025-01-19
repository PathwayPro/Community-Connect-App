import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Roles, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { FileValidationEnum } from './util/files-validation.enum';
import { Response } from 'express';
import * as path from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

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

  @Public()
  @Get(':filetype/:filename')
  async getFile(@Param('filetype') type: FileValidationEnum, @Param('filename') name: string, @Res() res: Response) {
    const filePath = path.join('uploads', type, name);
    return res.sendFile(filePath, { root: 'public' });
  }


}
