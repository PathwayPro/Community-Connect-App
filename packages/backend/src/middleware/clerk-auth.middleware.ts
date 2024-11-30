// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { createClerkClient } from '@clerk/backend';

// @Injectable()
// export class ClerkAuthMiddleware implements NestMiddleware {
//   private clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY,
//   });

//   async use(req: any, res: any, next: () => void) {
//     const token = req.headers['authorization'];

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: 'Authorization token is missing' });
//     }

//     try {
//       // Verify the session with the Clerk SDK
//       const session = await this.clerkClient.sessions.verifySession(
//         token.replace('Bearer ', ''),
//       );

//       // Attach the user info to the request object
//       req.user = session.user;

//       // Proceed to the next middleware or route handler
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         message: 'Invalid or expired token',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   }
// }
