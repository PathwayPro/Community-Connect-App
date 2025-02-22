import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, CreateCommentDto } from './dto/create.dto';
import { UpdatePostDto, UpdateCommentDto } from './dto/update.dto';
//import { FilterPostsDto, FilterCommentsDto } from './dto/filters.dto';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { UploadedFile } from 'src/files/util/uploaded-file.interface';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  getUserSelection() {
    return {
      id: true,
      first_name: true,
      middle_name: true,
      last_name: true,
    };
  }

  getPostSelection() {
    return {
      id: true,
      user: { select: this.getUserSelection() },
      message: true,
      created_at: true,
    };
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadedFile> {
    try {
      // UPLOAD IMAGE TO GET THE LINK
      const imageLink = await this.filesService.upload(
        FileValidationEnum.POST,
        file,
      );
      if (!imageLink) {
        throw new InternalServerErrorException(
          'There was a problem uploading the image. Please try again later',
        );
      }
      return imageLink;
    } catch (error) {
      throw new BadRequestException(
        'Error uploading the image for this post: ' + error.message,
      );
    }
  }

  async createPost(
    user: JwtPayload,
    newPost: CreatePostDto,
    file: Express.Multer.File | null,
  ) {
    try {
      // UPLOAD IMAGE AND GET THE LINK OR NULL
      const image = file ? await this.uploadImage(file) : null;

      // CREATE POST
      const postData: Prisma.PostsCreateInput = {
        user: { connect: { id: user.sub } },
        image: image ? image.path + '/' + image.fileName : null,
        message: newPost.message,
      };
      const post = await this.prisma.posts.create({
        data: postData,
        select: {
          user: {
            select: this.getUserSelection(),
          },
          message: true,
          created_at: true,
          image: true,
        },
      });

      return post;
    } catch (error) {
      throw new BadRequestException('Error creating post: ' + error.message);
    }
  }

  async createComment(user: JwtPayload, newComment: CreateCommentDto) {
    try {
      // CREATE COMMENT
      const commentData: Prisma.PostsCommentsCreateInput = {
        user: { connect: { id: user.sub } },
        post: { connect: { id: newComment.post_id } },
        message: newComment.message,
      };
      const comment = await this.prisma.postsComments.create({
        data: commentData,
        select: {
          user: { select: this.getUserSelection() },
          post: {
            select: {
              id: true,
              message: true,
              created_at: true,
              user: { select: this.getUserSelection() },
            },
          },
          message: true,
          created_at: true,
        },
      });

      return comment;
    } catch (error) {
      throw new BadRequestException('Error creating comment: ' + error.message);
    }
  }

  async createLike(user: JwtPayload, post_id: number) {
    try {
      // VERIFY POST EXIST
      const post = await this.prisma.posts.findFirst({
        where: { id: post_id },
      });
      if (!post) {
        throw new NotFoundException(`There is no post with ID #${post_id}`);
      }

      // CREATE (ADD) LIKE
      const likeData: Prisma.PostsLikesCreateInput = {
        user: { connect: { id: user.sub } },
        post: { connect: { id: post_id } },
      };
      const like = await this.prisma.postsLikes.create({
        data: likeData,
        select: {
          id: true,
          post_id: true,
          user_id: true,
          created_at: true,
        },
      });

      return like;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already liked this post.');
      }
      throw new BadRequestException('Error creating like: ' + error.message);
    }
  }

  async createSave(user: JwtPayload, post_id: number) {
    try {
      // VERIFY POST EXIST
      const post = await this.prisma.posts.findFirst({
        where: { id: post_id },
      });
      if (!post) {
        throw new NotFoundException(`There is no post with ID #${post_id}`);
      }

      // CREATE (ADD) SAVE
      const saveData: Prisma.PostsSavesCreateInput = {
        user: { connect: { id: user.sub } },
        post: { connect: { id: post_id } },
      };
      const save = await this.prisma.postsSaves.create({
        data: saveData,
        select: {
          id: true,
          post_id: true,
          user_id: true,
          created_at: true,
        },
      });

      return save;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already saved this post.');
      }
      throw new BadRequestException('Error creating save: ' + error.message);
    }
  }

  async updatePost(
    post_id: number,
    user: JwtPayload,
    updatedPost: UpdatePostDto,
    file: Express.Multer.File | null,
  ) {
    try {
      // VERIFY POST EXIST
      const currentPost = await this.prisma.posts.findFirst({
        where: { id: post_id },
      });
      if (!currentPost) {
        throw new NotFoundException(`There is no post with ID #${post_id}`);
      }

      // VERIFY IS ALLOWED TO EDIT (ADMIN | AUTHOR)
      const canEdit =
        user.roles === 'ADMIN' || currentPost.user_id === user.sub;
      if (!canEdit) {
        throw new UnauthorizedException(
          'You are not authorized to edit this post.',
        );
      }

      // UPLOAD IMAGE AND GET THE LINK OR NULL
      const image = file ? await this.uploadImage(file) : null;

      // UPDATE POST
      const postData: Prisma.PostsUpdateInput = {
        image: image ? image.path + '/' + image.fileName : null,
        message: updatedPost.message,
        updated_at: new Date(),
      };
      const post = await this.prisma.posts.update({
        where: { id: post_id },
        data: postData,
        select: {
          user: { select: this.getUserSelection() },
          message: true,
          created_at: true,
          image: true,
        },
      });

      return post;
    } catch (error) {
      throw new BadRequestException('Error updating post: ' + error.message);
    }
  }

  async updateComment(
    comment_id: number,
    user: JwtPayload,
    updatedComment: UpdateCommentDto,
  ) {
    try {
      // VERIFY COMMENT EXIST
      const currentComment = await this.prisma.postsComments.findFirst({
        where: { id: comment_id },
      });
      if (!currentComment) {
        throw new NotFoundException(
          `There is no comment with ID #${comment_id}`,
        );
      }

      // VERIFY IS ALLOWED TO EDIT (ADMIN | AUTHOR)
      const canEdit =
        user.roles === 'ADMIN' || currentComment.user_id === user.sub;
      if (!canEdit) {
        throw new UnauthorizedException(
          'You are not authorized to edit this comment.',
        );
      }

      // UPDATE COMMENT
      const commentData: Prisma.PostsCommentsUpdateInput = {
        message: updatedComment.message,
        updated_at: new Date(),
      };
      const comment = await this.prisma.postsComments.update({
        where: { id: comment_id },
        data: commentData,
        select: {
          post: { select: this.getPostSelection() },
          user: { select: this.getUserSelection() },
          message: true,
          updated_at: true,
        },
      });

      return comment;
    } catch (error) {
      throw new BadRequestException('Error updating comment: ' + error.message);
    }
  }

  async togglePostPublished(user: JwtPayload, post_id: number) {
    try {
      // IF NOT ADMIN RETURN UNAUTHORIZED
      if (user.roles !== 'ADMIN') {
        throw new UnauthorizedException(
          'You are not authorized to change the published status of this post.',
        );
      }

      // VERIFY POST EXIST
      const currentPost = await this.prisma.posts.findFirst({
        where: { id: post_id },
      });
      if (!currentPost) {
        throw new NotFoundException(`There is no post with ID #${post_id}`);
      }

      // UPDATE PUBLISHED STATUS: TOGGLE STATUS true => false | false => true
      const updatedPost = await this.prisma.posts.update({
        where: { id: post_id },
        data: { published: !currentPost.published },
        select: {
          ...this.getPostSelection(),
          published: true,
        },
      });

      return updatedPost;
    } catch (error) {
      throw new BadRequestException(
        'Error updating published status: ' + error.message,
      );
    }
  }

  async toggleCommentPublished(user: JwtPayload, comment_id: number) {
    try {
      // IF NOT ADMIN RETURN UNAUTHORIZED
      if (user.roles !== 'ADMIN') {
        throw new UnauthorizedException(
          'You are not authorized to change the published status of this comment.',
        );
      }

      // VERIFY COMMENT EXIST
      const currentComment = await this.prisma.postsComments.findFirst({
        where: { id: comment_id },
      });
      if (!currentComment) {
        throw new NotFoundException(
          `There is no comment with ID #${comment_id}`,
        );
      }

      // UPDATE PUBLISHED STATUS: TOGGLE STATUS true => false | false => true
      const updatedComment = await this.prisma.postsComments.update({
        where: { id: comment_id },
        data: { published: !currentComment.published },
        select: {
          id: true,
          message: true,
          updated_at: true,
          published: true,
          post: { select: this.getPostSelection() },
          user: { select: this.getUserSelection() },
        },
      });

      return updatedComment;
    } catch (error) {
      throw new BadRequestException(
        'Error updating published status: ' + error.message,
      );
    }
  }
}
