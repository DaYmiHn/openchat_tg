import { Injectable } from '@nestjs/common';

@Injectable()
export class WaitingMessageService {
  private map: Map<string, any>;

  constructor() {
    this.map = new Map<string, any>();
  }

  public set(key: string, value: any): void {
    this.map.set(key, value);
  }

  public get(key: string): any {
    return this.map.get(key);
  }

  public delete(key: string): boolean {
    return this.map.delete(key);
  }

  public has(key: string): boolean {
    return this.map.has(key);
  }
}
