import {
  Controller,
  //  Get,
  Post,
  Body,
  Patch,
  Param,
  //Delete,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ///Query,
} from '@nestjs/common';
import { PostEntity, Comment, Like, Save } from './entities/blog.entity';
import { BlogService } from './blog.service';
import { CreatePostDto, CreateCommentDto } from './dto/create.dto';
import { UpdatePostDto, UpdateCommentDto } from './dto/update.dto';
//import { FilterPostsDto, FilterCommentsDto } from './dto/filters.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiTags, ApiBody, ApiOperation, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiUnauthorizedResponse, ApiBadRequestResponse, } from '@nestjs/swagger';
// import { Roles, GetUser, Public, GetUserOptional } from 'src/auth/decorators';

import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Roles, GetUser } from 'src/auth/decorators';

import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // CREATE: POST | COMMENT | LIKE | SAVE
  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('/post')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ type: PostEntity })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the post: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create new post',
    description:
      'Creates a new post or throws Internal Server Error Exception. \n\n Using form-data for images (file) \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiBearerAuth()
  createPost(
    @GetUser() user: JwtPayload,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const newPost: CreatePostDto = { message: createPostDto.message };
    return this.blogService.createPost(user, newPost, file);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('/comment')
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ type: Comment })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the comment for this post: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create new comment for a post',
    description:
      'Creates a new message for a specific post or throws Internal Server Error Exception. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiBearerAuth()
  createComment(
    @GetUser() user: JwtPayload,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const newComment: CreateCommentDto = {
      post_id: createCommentDto.post_id,
      message: createCommentDto.message,
    };
    return this.blogService.createComment(user, newComment);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('/post/:post_id/like')
  @ApiParam({ name: 'post_id' })
  @ApiCreatedResponse({ type: Like })
  @ApiInternalServerErrorResponse({
    description: 'Error adding your like to this post: [ERROR MESSAGE]',
  })
  @ApiBadRequestResponse({ description: 'You have already liked this post' })
  @ApiNotFoundResponse({ description: 'There is no post with ID #`post_id`' })
  @ApiOperation({
    summary: 'Adds a like to a post',
    description:
      'Creates a new like for a specific post or throws exception [Bad Request | Not Found | Internal Server Error]. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiBearerAuth()
  createLike(@GetUser() user: JwtPayload, @Param('post_id') post_id: string) {
    return this.blogService.createLike(user, +post_id);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post('/post/:post_id/save')
  @ApiParam({ name: 'post_id' })
  @ApiCreatedResponse({ type: Save })
  @ApiInternalServerErrorResponse({
    description: 'Error saving post: [ERROR MESSAGE]',
  })
  @ApiBadRequestResponse({ description: 'You have already saved this post' })
  @ApiNotFoundResponse({ description: 'There is no post with ID #`post_id`' })
  @ApiOperation({
    summary: 'Saves a post for the logged user',
    description:
      'Saves a specific post for the logged user or throws exception [Bad Request | Not Found | Internal Server Error]. \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**',
  })
  @ApiBearerAuth()
  createSave(@GetUser() user: JwtPayload, @Param('post_id') post_id: string) {
    return this.blogService.createSave(user, +post_id);
  }

  // UPDATE: POST | COMMENT
  @Roles('ADMIN', 'MENTOR', 'USER')
  @Patch('/post/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ type: PostEntity })
  @ApiNotFoundResponse({ description: 'There is no post with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating post with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update post',
    description: `
        Update post with ID {:id}
        \n\n Using form-data for images (file)
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * ADMIN can update any post
        \n\n * MENTOR can update their posts
        \n\n * USERS can update their posts
      `,
  })
  @ApiBearerAuth()
  updatePost(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const updatedPost: UpdatePostDto = { message: updatePostDto.message };
    return this.blogService.updatePost(+id, user, updatedPost, file);
  }

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Patch('/comment/:id')
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'There is no comment with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating comment with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update comment',
    description: `
        Update comment with ID {:id}
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * ADMIN can update any comment
        \n\n * MENTOR can update their comment
        \n\n * USERS can update their comment
      `,
  })
  @ApiBearerAuth()
  updateComment(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const updatedComment: UpdateCommentDto = {
      message: updateCommentDto.message,
    };
    return this.blogService.updateComment(+id, user, updatedComment);
  }

  @Roles('ADMIN')
  @Put('post/:id')
  @ApiOkResponse({ type: PostEntity })
  @ApiNotFoundResponse({
    description:
      'There is no post with ID #[:id] to update its published status',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error updating published status: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Toggle `published` status',
    description: `
        Toggle \`published\` status. 
        \n\n When \`published\` is \`false\`, the post will only be seen by admins. 
        \n\n REQUIRED ROLES: **ADMIN**
      `,
  })
  @ApiBearerAuth()
  togglePostPublished(
    @GetUser() user: JwtPayload,
    @Param('id') post_id: string,
  ) {
    return this.blogService.togglePostPublished(user, +post_id);
  }

  @Roles('ADMIN')
  @Put('comment/:id')
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse({
    description:
      'There is no comment with ID #[:id] to update its published status',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Toggle `published` status',
    description: `
        Toggle \`published\` status. 
        \n\n When \`published\` is \`false\`, the comment will only be seen by admins. 
        \n\n REQUIRED ROLES: **ADMIN**
      `,
  })
  @ApiBearerAuth()
  toggleCommentPublished(
    @GetUser() user: JwtPayload,
    @Param('id') comment_id: string,
  ) {
    return this.blogService.toggleCommentPublished(user, +comment_id);
  }

  // FIND ONE: POST | COMMENT
  // @Public()
  // @Get('/post/:id')
  // @ApiOkResponse({ type: PostEntity })
  // @ApiInternalServerErrorResponse({ description: 'Error fetching post: [ERROR MESSAGE]', })
  // @ApiNotFoundResponse({ description: 'There is no post with ID #[:id]' })
  // @ApiUnauthorizedResponse({ description: 'If the post is "unpublished" and the user is not admin or the owner of the post', })
  // @ApiOperation({
  //   summary: 'Fetch post by ID',
  //   description: `
  //     Fetch one post by ID.
  //     \n\n REQUIRED ROLES: **PUBLIC**
  //     \n\n OPTIONAL ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * IF THE POST IS PUBLISHED: Always return the post.
  //     \n\n * IF THE USER ROLE IS "ADMIN": Always return the post.
  //     \n\n * IF THE POST IS UNPUBLISHED: If the user is **NOT** the owner of the post, returns Unauthorized
  //   `,
  // })
  // @ApiParam({ name: 'id' })
  // findOnePost(@GetUserOptional() user: JwtPayload | undefined, @Param('id') id: string,) {
  //   //return this.blogService.findOnePost(+id, user);
  // }

  // @Public()
  // @Get('/comment/:id')
  // @ApiOkResponse({ type: Comment })
  // @ApiInternalServerErrorResponse({ description: 'Error fetching comment: [ERROR MESSAGE]', })
  // @ApiNotFoundResponse({ description: 'There is no comment with ID #[:id]' })
  // @ApiUnauthorizedResponse({ description: 'If the comment is "unpublished" and the user is not admin or the owner of the comment', })
  // @ApiOperation({
  //   summary: 'Fetch comment by ID',
  //   description: `
  //     Fetch one comment by ID.
  //     \n\n REQUIRED ROLES: **PUBLIC**
  //     \n\n OPTIONAL ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * IF THE COMMENT IS PUBLISHED: Always return the comment.
  //     \n\n * IF THE USER ROLE IS "ADMIN": Always return the comment.
  //     \n\n * IF THE COMMENT IS UNPUBLISHED: If the user is **NOT** the owner of the comment, returns Unauthorized
  //   `,
  // })
  // @ApiParam({ name: 'id' })
  // findOneComment(@GetUserOptional() user: JwtPayload | undefined, @Param('id') id: string,) {
  //   //return this.blogService.findOneComment(+id, user);
  // }

  // FIND ALL: POST | COMMENTS
  // @Public()
  // @Get('/post')
  // @ApiOkResponse({ type: PostEntity, isArray: true })
  // @ApiInternalServerErrorResponse({ description: 'Error fetching posts: [ERROR MESSAGE]', })
  // @ApiOperation({
  //   summary: 'Fetch posts',
  //   description: `
  //       Fetch posts.
  //       \n\n REQUIRED ROLES: **PUBLIC**
  //       \n\n OPTIONAL ROLES: **ADMIN | MENTOR | USER**
  //       \n\n **VALIDATIONS:**
  //       \n\n * ONLY ADMIN USERS CAN FETCH "UNPUBLISHED" POSTS
  //       \n\n * IF THERE IS NO USER OR THE USER IS NOT ADMIN, "PUBLISHED" FILTER IS FORCED TO "TRUE"
  //     `,
  // })
  // findAllPosts(@GetUserOptional() user: JwtPayload | undefined, @Query() filters: FilterPostsDto,) {
  //   // Set filter "Date to" to the end of the day if exists
  //   const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
  //   if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

  //   const searchFilters: FilterPostsDto = {
  //     message: filters.message,
  //     published: user?.roles === 'ADMIN' ? filters.published : true,
  //     user_id: filters.user_id,
  //     date_from: filters.date_from ? new Date(filters.date_from) : null,
  //     date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
  //   };
  //   //return this.blogService.findAllPosts(searchFilters);
  // }

  // @Public()
  // @Get('/comments')
  // @ApiOkResponse({ type: Comment, isArray: true })
  // @ApiInternalServerErrorResponse({ description: 'Error fetching comments: [ERROR MESSAGE]', })
  // @ApiOperation({
  //   summary: 'Fetch comments',
  //   description: `
  //       Fetch comments.
  //       \n\n REQUIRED ROLES: **PUBLIC**
  //       \n\n OPTIONAL ROLES: **ADMIN | MENTOR | USER**
  //       \n\n **VALIDATIONS:**
  //       \n\n * ONLY ADMIN USERS CAN FETCH "UNPUBLISHED" COMMENTS
  //       \n\n * IF THERE IS NO USER OR THE USER IS NOT ADMIN, "PUBLISHED" FILTER IS FORCED TO "TRUE"
  //     `,
  // })
  // findAllComments(@GetUserOptional() user: JwtPayload | undefined, @Query() filters: FilterCommentsDto,) {
  //   // Set filter "Date to" to the end of the day if exists
  //   const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
  //   if (filterDateTo) { filterDateTo.setUTCHours(23, 59, 59); }

  //   const searchFilters: FilterCommentsDto = {
  //     message: filters.message,
  //     published: user?.roles === 'ADMIN' ? filters.published : true,
  //     user_id: filters.user_id,
  //     date_from: filters.date_from ? new Date(filters.date_from) : null,
  //     date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
  //   };
  //   //return this.blogService.findAllComments(searchFilters);
  // }

  // DELETE: POST | COMMENT | LIKE | SAVE
  // @Roles('ADMIN', 'MENTOR', 'USER')
  // @Delete('post/:id')
  // @ApiOkResponse({ type: PostEntity })
  // @ApiNotFoundResponse({ description: 'There is no post with ID #[:id] to delete', })
  // @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  // @ApiOperation({
  //   summary: 'Delete a post',
  //   description: `
  //     Delete a post and its related data (comments, likes, saves)
  //     \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * ADMIN can delete any post
  //     \n\n * MENTOR | USER can delete their own posts
  //   `,
  // })
  // @ApiBearerAuth()
  // deletePost(@GetUser() user: JwtPayload, @Param('id') post_id: string,) {
  //   //return this.blogService.deletePost(user, +post_id);
  // }

  // @Roles('ADMIN', 'MENTOR', 'USER')
  // @Delete('comment/:id')
  // @ApiOkResponse({ type: Comment })
  // @ApiNotFoundResponse({ description: 'There is no comment with ID #[:id] to delete', })
  // @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  // @ApiOperation({
  //   summary: 'Delete a comment',
  //   description: `
  //     Delete a comment
  //     \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * ADMIN can delete any comment
  //     \n\n * MENTOR | USER can delete their own comments
  //   `,
  // })
  // @ApiBearerAuth()
  // deleteComment(@GetUser() user: JwtPayload, @Param('id') comment_id: string,) {
  //   //return this.blogService.deleteComment(user, +comment_id);
  // }

  // @Roles('ADMIN', 'MENTOR', 'USER')
  // @Delete('like/:id')
  // @ApiOkResponse({ type: Like })
  // @ApiNotFoundResponse({ description: 'There is no like with ID #[:id] to delete', })
  // @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  // @ApiOperation({
  //   summary: 'Delete a like',
  //   description: `
  //     Delete a like
  //     \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * Any user can remove their own likes
  //   `,
  // })
  // @ApiBearerAuth()
  // deleteLike(@GetUser() user: JwtPayload, @Param('id') like_id: string,) {
  //   //return this.blogService.deleteLike(user, +like_id);
  // }

  // @Roles('ADMIN', 'MENTOR', 'USER')
  // @Delete('save/:id')
  // @ApiOkResponse({ type: Save })
  // @ApiNotFoundResponse({ description: 'There is no save with ID #[:id] to delete', })
  // @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  // @ApiOperation({
  //   summary: 'Delete a saved post',
  //   description: `
  //     Delete a save
  //     \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
  //     \n\n **VALIDATIONS:**
  //     \n\n * Any user can remove their own saved posts
  //   `,
  // })
  // @ApiBearerAuth()
  // deleteSave(@GetUser() user: JwtPayload, @Param('id') save_id: string,) {
  //   //return this.blogService.deleteSave(user, +save_id);
  // }
}
