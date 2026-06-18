import type { MCPRequest, MCPResponse } from '@helix/types';

export class MCPTransport {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async send(request: MCPRequest): Promise<MCPResponse> {
    const response = await fetch(`${this.url}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json() as Promise<MCPResponse>;
  }
}
