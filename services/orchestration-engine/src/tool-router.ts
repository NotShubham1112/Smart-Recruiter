import type { MCPRequest, MCPResponse } from '@helix/types';

type ToolHandler = (params: Record<string, unknown>) => Promise<unknown>;

export class ToolRouter {
  private tools = new Map<string, ToolHandler>();

  register(name: string, handler: ToolHandler): void {
    this.tools.set(name, handler);
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const handler = this.tools.get(request.tool);
    if (!handler) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_NOT_FOUND', message: `Tool '${request.tool}' not found` },
        metadata: { timestamp: new Date().toISOString(), durationMs: 0 },
      };
    }
    const startTime = Date.now();
    try {
      const result = await handler(request.params);
      return {
        id: request.id,
        result,
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    } catch (error) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_ERROR', message: (error as Error).message },
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    }
  }
}
