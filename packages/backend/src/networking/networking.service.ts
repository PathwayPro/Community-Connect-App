import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateConnectionRequestsDto,
  CreateConnectedUsersDto,
  CreateMessagesDto,
} from './dto/create-networking.dto';
import { UpdateConnectionRequestsDto } from './dto/update-networking.dto';
import { PrismaService } from 'src/database';
import { FilterConnectionRequestsDto } from './dto/filter-networking.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NetworkingService {
  constructor(private prisma: PrismaService) {}

  // CONNECTIONS FLOW
  getFormattedFilters_CR(
    userId: number,
    filters: FilterConnectionRequestsDto,
  ): Prisma.ConnectionRequestsWhereInput {
    const formattedFilters: Prisma.ConnectionRequestsWhereInput = {};

    // The user must be the sender or recipient and can filter by the other user
    const relatedUsers = filters?.user_id
      ? {
          OR: [
            {
              AND: [{ sender_id: userId }, { recipient_id: +filters.user_id }],
            },
            {
              AND: [{ sender_id: +filters.user_id }, { recipient_id: userId }],
            },
          ],
        }
      : {
          OR: [{ sender_id: userId }, { recipient_id: userId }],
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

    return { AND: [relatedUsers, formattedFilters] };
  }

  async connectionRequestExists(
    sender_id: number,
    recipient_id: number,
  ): Promise<CreateConnectionRequestsDto | false> {
    const cr = await this.prisma.connectionRequests.findFirst({
      where: {
        OR: [
          { sender_id: sender_id, recipient_id: recipient_id },
          { sender_id: recipient_id, recipient_id: sender_id },
        ],
      },
    });
    return cr ? cr : false;
  }

  async createConnectionRequest(
    sender_id: number,
    createConnectionRequestsDto: CreateConnectionRequestsDto,
  ) {
    try {
      // VALIDATE SENDER AND RECIPIENT ARE DIFFERENT
      if (sender_id === createConnectionRequestsDto.recipient_id) {
        throw new BadRequestException('Sender and recipient are the same');
      }

      // VALIDATE RECIPIENT EXIST
      const recipient = await this.prisma.users.findFirst({
        where: { id: createConnectionRequestsDto.recipient_id },
      });
      if (!recipient) {
        throw new BadRequestException(
          'There is no user with ID ' +
            createConnectionRequestsDto.recipient_id,
        );
      }

      // VALIDATE PREVIOUS REQUESTS
      const previousRequest = await this.connectionRequestExists(
        sender_id,
        createConnectionRequestsDto.recipient_id,
      );
      if (previousRequest) {
        throw new UnauthorizedException(
          'There is already a connection request between these users',
        );
      }

      // CREATE THE CONNECTION REQUEST
      const newConnectionRequest = await this.prisma.connectionRequests.create({
        data: { ...createConnectionRequestsDto, status: 'PENDING', sender_id },
      });
      if (!newConnectionRequest) {
        throw new InternalServerErrorException(
          'There was an error creating the connection requerst. Try again later.',
        );
      }

      return newConnectionRequest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateConnectionRequestStatus(
    id: number,
    user_id: number,
    updateConnectionRequestsDto: UpdateConnectionRequestsDto,
  ) {
    try {
      // VALIDATE CONNECTION REQUEST EXIST
      const connectionRequest = await this.prisma.connectionRequests.findFirst({
        where: { id },
      });
      if (!connectionRequest) {
        throw new BadRequestException(
          'There is no connection request with ID: ' + id,
        );
      }

      // VALIDATE USER IS RECIPIENT
      if (connectionRequest.recipient_id !== user_id) {
        throw new UnauthorizedException(
          'You are not allowed to change this connection request status',
        );
      }

      // UPDATE STATUS
      const updatedConnectionRequest =
        await this.prisma.connectionRequests.update({
          where: { id },
          data: {
            status: updateConnectionRequestsDto.status,
            updated_at: new Date(),
          },
        });

      // IF STATUS === 'APPROVED' - - - > CREATE CONNECTION
      if (updatedConnectionRequest.status === 'APPROVED') {
        const data: CreateConnectedUsersDto = {
          sender_id: updatedConnectionRequest.sender_id,
          recipient_id: updatedConnectionRequest.recipient_id,
        };
        const newConnection = await this.prisma.connectedUsers.create({ data });
        if (!newConnection) {
          throw new InternalServerErrorException(
            'There was an error creating the connection. Please try again later.',
          );
        }
      }

      // RETURN UPDATED CONNECTION REQUEST
      return updatedConnectionRequest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllConnectionRequest(
    userId: number,
    filters: FilterConnectionRequestsDto,
  ) {
    try {
      // Get all users except the logged-in user
      const users = await this.prisma.users.findMany({
        where: {
          id: { not: userId },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          picture_upload_link: true,
          profession: true,
          company_name: true,
          country_of_origin: true,
          skills: true,
          role: true,
          bio: true,
          linkedin_link: true,
          github_link: true,
          twitter_link: true,
          portfolio_link: true,
        },
        orderBy: {
          first_name: 'asc',
        },
      });

      // Get all connection requests for the logged-in user
      const connectionRequests = await this.prisma.connectionRequests.findMany({
        where: {
          OR: [{ sender_id: userId }, { recipient_id: userId }],
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Create a map of connection request status for each user
      const statusMap = new Map();
      connectionRequests.forEach((request) => {
        const otherUserId =
          request.sender_id === userId
            ? request.recipient_id
            : request.sender_id;

        statusMap.set(otherUserId, {
          status: request.status,
          requestId: request.id,
          isIncoming: request.recipient_id === userId,
          isSender: request.sender_id === userId,
        });
      });

      // Combine user data with connection status
      const enrichedUsers = users.map((user) => ({
        ...user,
        connectionStatus: statusMap.get(user.id) || {
          status: 'NO_REQUEST',
          requestId: null,
          isIncoming: null,
          isSender: null,
        },
      }));

      return enrichedUsers;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneConnectionRequest(id: number, userId: number) {
    try {
      // VALIDATE USER IS SENDER OR RECIPIENT
      const connectionRequest: CreateConnectionRequestsDto =
        await this.prisma.connectionRequests.findFirst({
          where: {
            id: id,
            OR: [{ sender_id: userId }, { recipient_id: userId }],
          },
        });
      if (!connectionRequest) {
        throw new BadRequestException(
          "The connection request doesn't exist or is not associated to your user",
        );
      }
      return connectionRequest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async connections(userId: number) {
    try {
      const connectedUsers = await this.prisma.connectedUsers.findMany({
        where: {
          OR: [{ sender_id: userId }, { recipient_id: userId }],
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          created_at: true,
          sender: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
          recipient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      return connectedUsers;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // MESSAGES FLOW
  async createMessage(sender_id: number, newMessage: CreateMessagesDto) {
    try {
      // VALIDATE USERS ARE CONNECTED
      const connection = await this.prisma.connectedUsers.findFirst({
        where: {
          OR: [
            {
              AND: [
                { sender_id: sender_id },
                { recipient_id: newMessage.recipient_id },
              ],
            },
            {
              AND: [
                { recipient_id: sender_id },
                { sender_id: newMessage.recipient_id },
              ],
            },
          ],
        },
      });
      if (!connection) {
        throw new UnauthorizedException(
          'You are not authorized to contact this user. Send a connection request instead',
        );
      }

      // IF USERS ARE CONNECTED, CREATE THE MESSAGE
      const message = await this.prisma.messages.create({
        data: { sender_id, ...newMessage },
      });
      if (!message) {
        throw new InternalServerErrorException(
          'There was an error sending your message. Please try again later',
        );
      }

      return message;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async chatList(userId: number) {
    try {
      const chats = await this.prisma.$queryRaw<any[]>`
        WITH CombinedMessages AS (
          SELECT
            CASE 
              WHEN sender_id = ${userId} THEN recipient_id
              ELSE sender_id
            END AS user_chat,
            created_at,
            'MESSAGE' as type,
            message as message,
            NULL as status
          FROM "Messages" m
          WHERE (recipient_id = ${userId} OR sender_id = ${userId})

          UNION ALL

          SELECT
            CASE 
              WHEN sender_id = ${userId} THEN recipient_id
              ELSE sender_id
            END AS user_chat,
            created_at,
            'CONNECTION_REQUEST' as type,
            message,
            status::text
          FROM "ConnectionRequests" cr
          WHERE (recipient_id = ${userId} OR sender_id = ${userId})
        )
        SELECT DISTINCT ON (cm.user_chat)
          cm.user_chat,
          cm.created_at AS last_message,
          u.first_name,
          u.last_name,
          u.picture_upload_link,
          cm.type as last_message_type,
          cm.message as last_message_content,
          cm.status as connection_status
        FROM 
          CombinedMessages cm
        JOIN 
          "users" u ON u.id = cm.user_chat
        ORDER BY 
          cm.user_chat,
          cm.created_at DESC;
      `;

      // Sort the results by last_message in descending order
      return chats.sort(
        (a, b) =>
          new Date(b.last_message).getTime() -
          new Date(a.last_message).getTime(),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async chat(userId: number, userChat: number) {
    try {
      if (userId === userChat) {
        throw new BadRequestException('There is no conversation with yourself');
      }

      const chatHistory = await this.prisma.$queryRaw`
        SELECT * FROM (
          SELECT 
            'MESSAGE' as type,
            m.id,
            m.sender_id,
            m.recipient_id,
            m.message,
            m.created_at,
            NULL as status,
            -- Sender details
            s.first_name as sender_first_name,
            s.last_name as sender_last_name,
            s.picture_upload_link as sender_picture_upload_link,
            s.role as sender_role,
            -- Recipient details
            r.first_name as recipient_first_name,
            r.last_name as recipient_last_name,
            r.picture_upload_link as recipient_picture_upload_link,
            r.role as recipient_role
          FROM "Messages" m
          JOIN "users" s ON m.sender_id = s.id
          JOIN "users" r ON m.recipient_id = r.id
          WHERE 
            (m.sender_id = ${userId} AND m.recipient_id = ${userChat})
            OR 
            (m.sender_id = ${userChat} AND m.recipient_id = ${userId})
          
          UNION ALL
          
          SELECT 
            'CONNECTION_REQUEST' as type,
            cr.id,
            cr.sender_id,
            cr.recipient_id,
            cr.message,
            cr.created_at,
            cr.status::text,
            -- Sender details
            s.first_name as sender_first_name,
            s.last_name as sender_last_name,
            s.picture_upload_link as sender_picture_upload_link,
            s.role as sender_role,
            -- Recipient details
            r.first_name as recipient_first_name,
            r.last_name as recipient_last_name,
            r.picture_upload_link as recipient_picture_upload_link,
            r.role as recipient_role
          FROM "ConnectionRequests" cr
          JOIN "users" s ON cr.sender_id = s.id
          JOIN "users" r ON cr.recipient_id = r.id
          WHERE 
            (cr.sender_id = ${userId} AND cr.recipient_id = ${userChat})
            OR 
            (cr.sender_id = ${userChat} AND cr.recipient_id = ${userId})
        ) combined
        ORDER BY created_at ASC
      `;

      return chatHistory;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
