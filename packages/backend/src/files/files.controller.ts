import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Roles, GetUser, Public } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FileValidationEnum } from './util/files-validation.enum';
import { Response } from 'express';
import * as path from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('/profile-picture')
  uploadProfilePicture(@GetUser() user: JwtPayload, @Body() file: Express.Multer.File) {
    return this.filesService.upload(user, FileValidationEnum.PROFILE_PICTURE, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/resources')
  uploadResources(@GetUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(user, FileValidationEnum.RESOURCES, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @Post('/events')
  uploadEvents(@GetUser() user: JwtPayload, @Body() file: Express.Multer.File) {
    return this.filesService.upload(user, FileValidationEnum.EVENTS, file);
  }

  @Roles('ADMIN')
  @Post('/news')
  uploadNews(@GetUser() user: JwtPayload, @Body() file: Express.Multer.File) {
    return this.filesService.upload(user, FileValidationEnum.NEWS, file);
  }

  @Public()
  @Get(':filetype/:filename')
  async getFile(@Param('filetype') type: FileValidationEnum, @Param('filename') name: string, @Res() res: Response) {
    const filePath = path.join('uploads', type, name);
    return res.sendFile(filePath, { root: 'public' });
  }


}
