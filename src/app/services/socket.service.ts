import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private readonly socket: Socket;

  constructor(private zone: NgZone) {
    // In dev, ng serve proxies /socket.io → localhost:3000.
    // In production, Express serves both the Angular build and Socket.io.
    this.socket = io({ transports: ['websocket', 'polling'] });
  }

  /** Returns an Observable that emits whenever the given socket event fires. */
  on<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      const handler = (data: T) => this.zone.run(() => observer.next(data));
      this.socket.on(event, handler);
      return () => this.socket.off(event, handler);
    });
  }

  emit(event: string, data?: unknown): void {
    this.socket.emit(event, data);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
