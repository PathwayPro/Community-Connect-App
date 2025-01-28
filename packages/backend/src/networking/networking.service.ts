import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConnectionRequestsDto, CreateConnectedUsersDto, CreateMessagesDto } from './dto/create-networking.dto';
import { UpdateConnectionRequestsDto } from './dto/update-networking.dto';
import { PrismaService } from 'src/database';
import ChatList from './dto/ChatList.interface'
import { FilterConnectionRequestsDto } from './dto/filter-networking.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NetworkingService {
  constructor(private prisma: PrismaService) { }

  // CONNECTIONS FLOW
  getFormattedFilters_CR(userId: number, filters: FilterConnectionRequestsDto): Prisma.ConnectionRequestsWhereInput {
    const formattedFilters: Prisma.ConnectionRequestsWhereInput = {};
    
    // The user must be the sender or recipient and can filter by the other user
    const relatedUsers = (filters?.user_id) ? 
    {OR: [
      { AND: [{sender_id: userId}, {recipient_id: +filters.user_id}] },
      { AND: [{sender_id: +filters.user_id}, {recipient_id: userId}] }
    ]} 
    : 
    {
      OR: [
        { sender_id: userId },
        { recipient_id: userId }
      ]
    };

    // Filter by status
    if (filters?.status) {
      formattedFilters.status = filters.status;
    }

    // Filter by date from, date to or both
    if (filters?.date_from && filters?.date_to) {
      formattedFilters.created_at = {
        gte: filters.date_from,
        lte: filters.date_to,
      };
    } else if (filters?.date_from) {
      formattedFilters.created_at = {
        gte: filters.date_from,
      };
    } else if (filters?.date_to) {
      formattedFilters.created_at = {
        lte: filters.date_to,
      };
    }


    return { AND: [relatedUsers, formattedFilters] };;
  }

  async connectionRequestExists(sender_id: number, recipient_id: number): Promise<CreateConnectionRequestsDto | false> {
    const cr = await this.prisma.connectionRequests.findFirst({
      where: {
        OR: [
          { sender_id: sender_id, recipient_id: recipient_id },
          { sender_id: recipient_id, recipient_id: sender_id }
        ]
      }
    })
    return (cr) ? cr : false;
  }

  async createConnectionRequest(createConnectionRequestsDto: CreateConnectionRequestsDto) {
    try {
      // VALIDATE SENDER AND RECIPIENT ARE DIFFERENT
      if (createConnectionRequestsDto.sender_id === createConnectionRequestsDto.recipient_id) {
        throw new BadRequestException('Sender and recipient are the same')
      }

      // VALIDATE SENDER EXIST
      const sender = await this.prisma.users.findFirst({ where: { id: createConnectionRequestsDto.sender_id } })
      if (!sender) {
        throw new BadRequestException('There is no user with ID ' + createConnectionRequestsDto.sender_id)
      }

      // VALIDATE RECIPIENT EXIST
      const recipient = await this.prisma.users.findFirst({ where: { id: createConnectionRequestsDto.recipient_id } })
      if (!recipient) {
        throw new BadRequestException('There is no user with ID ' + createConnectionRequestsDto.recipient_id)
      }

      // VALIDATE PREVIOUS REQUESTS
      const previousRequest = await this.connectionRequestExists(createConnectionRequestsDto.sender_id, createConnectionRequestsDto.recipient_id);
      if (previousRequest) {
        throw new UnauthorizedException('There is already a connection request between these users')
      }

      // CREATE THE CONNECTION REQUEST
      const newConnectionRequest = await this.prisma.connectionRequests.create({ data: createConnectionRequestsDto })
      if (!newConnectionRequest) {
        throw new InternalServerErrorException('There was an error creating the connection requerst. Try again later.');
      }

      return newConnectionRequest;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateConnectionRequestStatus(id: number, user_id: number, updateConnectionRequestsDto: UpdateConnectionRequestsDto) {
    try {
      // VALIDATE CONNECTION REQUEST EXIST
      const connectionRequest = await this.prisma.connectionRequests.findFirst({ where: { id } })
      if (!connectionRequest) {
        throw new BadRequestException('There is no connection request with ID: ' + id)
      }

      // VALIDATE USER IS RECIPIENT
      if (connectionRequest.recipient_id !== user_id) {
        throw new UnauthorizedException('You are not allowed to change this connection request status')
      }

      // UPDATE STATUS
      const updatedConnectionRequest = await this.prisma.connectionRequests.update({ where: { id }, data: { status: updateConnectionRequestsDto.status, updated_at: new Date() } })

      // IF STATUS === 'APPROVED' - - - > CREATE CONNECTION
      if (updatedConnectionRequest.status === 'APPROVED') {
        const data: CreateConnectedUsersDto = {
          sender_id: updatedConnectionRequest.sender_id,
          recipient_id: updatedConnectionRequest.recipient_id
        }
        const newConnection = await this.prisma.connectedUsers.create({ data })
        if (!newConnection) {
          throw new InternalServerErrorException('There was an error creating the connection. Please try again later.')
        }
      }

      // RETURN UPDATED CONNECTION REQUEST
      return updatedConnectionRequest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllConnectionRequest(userId: number, filters: FilterConnectionRequestsDto) {
    try {
      const appliedFilters: Prisma.ConnectionRequestsWhereInput = this.getFormattedFilters_CR(userId, filters);
      const connectionRequests: CreateConnectionRequestsDto[] = await this.prisma.connectionRequests.findMany({where: appliedFilters})

      return connectionRequests;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneConnectionRequest(id: number, userId: number) {
    try {
      // VALIDATE USER IS SENDER OR RECIPIENT
      const connectionRequest: CreateConnectionRequestsDto = await this.prisma.connectionRequests.findFirst({
        where: {
          id: id,
          OR: [
            { sender_id: userId },
            { recipient_id: userId }
          ]
        }
      })
      if (!connectionRequest) {
        throw new BadRequestException("The connection request doesn't exist or is not associated to your user")
      }
      return connectionRequest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async connections(userId: number){
    try{
      const connectedUsers = this.prisma.connectedUsers.findMany({
        where: {
          OR: [
            {sender_id: userId},
            {recipient_id: userId}
          ]
        },
        orderBy: {
          created_at: 'desc'
        },
        select: {
          created_at: true,
          sender: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true
            }
          },
          recipient: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true
            }
          }
        }
      })

      return connectedUsers;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // MESSAGES FLOW
  async createMessage(newMessage: CreateMessagesDto) {
    try {
      // VALIDATE USERS ARE CONNECTED
      const connection = await this.prisma.connectedUsers.findFirst({
        where: {
          OR: [
            {
              AND: [
                { sender_id: newMessage.sender_id },
                { recipient_id: newMessage.recipient_id }
              ]
            },
            {
              AND: [
                { recipient_id: newMessage.sender_id },
                { sender_id: newMessage.recipient_id }
              ]
            },
          ]
        }
      })
      if (!connection) {
        throw new UnauthorizedException('You are not authorized to contact this user. Send a connection request instead')
      }

      // IF USERS ARE CONNECTED, CREATE THE MESSAGE
      const message = await this.prisma.messages.create({ data: newMessage })
      if (!message) {
        throw new InternalServerErrorException('There was an error sending your message. Please try again later');
      }

      return message;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async chatList(userId: number) {
    try {

      const chats = await this.prisma.$queryRaw<ChatList>`
        SELECT
          CASE 
            WHEN sender_id = ${userId} THEN recipient_id
            ELSE sender_id
          END AS user_chat,
          MAX(created_at) AS last_message,
          u.first_name,
          u.middle_name,
          u.last_name
        FROM 
          "Messages" m
        JOIN 
          "users" u ON 
            CASE 
              WHEN sender_id = ${userId} THEN u.id = m.recipient_id
              ELSE u.id = m.sender_id
            END
        WHERE (recipient_id = ${userId} OR sender_id = ${userId})
        GROUP BY user_chat, u.first_name, u.middle_name, u.last_name;
      `;

      return chats;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async chat(userId: number, userChat: number) {
    try {
      // VALIDATE LOGGED USER AND CHAT USER ARE DIFFERENET
      if(userId === userChat){
        throw new BadRequestException("There is no conversation with yourself")
      }

      const messages = await this.prisma.messages.findMany({
        where:{
          OR: [
            { AND: [{sender_id: userId}, {recipient_id: userChat}]},
            { AND: [{sender_id: userChat}, {recipient_id: userId}]}
          ]
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      return messages;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }
}
