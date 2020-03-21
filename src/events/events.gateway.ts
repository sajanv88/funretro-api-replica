import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as uuid from 'uuid';

@WebSocketGateway(3002, { transport: ['websocket'] })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private interval: any;
  private count: any;
  private clients: Map<string, any> = new Map();

  afterInit(server: Server) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('handleConnection', client.id);

    // console.log('handleConnection --- args', args);
    if (!this.clients.has(client.id)) {
      client.id = uuid.v4();
      this.clients.set(client.id, client);
    }
  }

  handleDisconnect(client: any) {
    console.log('handleDisconnect', client.id);
    if (this.clients.has(client.id)) {
      this.clients.delete(client.id);
    }
  }

  @SubscribeMessage('refresh')
  onEvent(client: any, data: any): void {
    this.clients.forEach((value: any, key: string) => {
      value.send(
        JSON.stringify({
          message: 'update',
        }),
      );
    });
  }
}
