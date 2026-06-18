export interface MCPRequest {
    id: string;
    tool: string;
    params: Record<string, unknown>;
    metadata?: RequestMetadata;
}
export interface MCPResponse {
    id: string;
    result: unknown;
    error?: MCPError;
    metadata: ResponseMetadata;
}
export interface MCPError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export interface RequestMetadata {
    timestamp: string;
    source: string;
    correlationId?: string;
}
export interface ResponseMetadata {
    timestamp: string;
    durationMs: number;
    model?: string;
    tokensUsed?: number;
}
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema: Record<string, unknown>;
}
//# sourceMappingURL=mcp.d.ts.map