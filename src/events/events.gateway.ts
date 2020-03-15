import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(3002, { transport: ['websocket'] })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('refresh')
  onEvent(client: any, data: any): void {
    console.log('update...');
    this.server.clients.forEach(c => {
      c.send('update');
    });
  }
}
