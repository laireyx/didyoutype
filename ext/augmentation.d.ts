interface WebRequest {}
type WebRequestHandler<WebResponse> = (req: WebRequest) => Promise<WebResponse>;

export function onRequest(handler: WebRequestHandler<unknown>): void;
