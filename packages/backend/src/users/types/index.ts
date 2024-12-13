import { ReadUserDto } from '../dto/user.dto';

export type RegisterUserResponse = {
  message: string;
  data: ReadUserDto;
};
