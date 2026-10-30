import type { IncomingMessage, ServerResponse } from 'http';
import { parse as parseUrl } from 'url';
import { fetchDailyBriefing, askHistoryAI } from './geminiService';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const parsed = parseUrl(req.url || '', true);
  const pathname = parsed.pathname || '';

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  // Helper to send json
  const sendJson = (data: unknown, status = 200) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };

  // Helper to read body
  const readBody = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  };

  try {
    if (pathname === '/api/briefing') {
      const date = (parsed.query.date as string) || new Date().toISOString().slice(0, 10);
      const briefing = await fetchDailyBriefing(date);
      sendJson(briefing);
      return true;
    }

    if (pathname === '/api/chat' && req.method === 'POST') {
      const body = await readBody();
      const userQuery = body.message || '';
      const history = body.history || [];
      const context = body.context;
      const result = await askHistoryAI(userQuery, history, context);
      sendJson(result);
      return true;
    }

    if (pathname === '/api/status') {
      sendJson({ status: 'ok', timestamp: new Date().toISOString() });
      return true;
    }

    sendJson({ error: 'Endpoint not found' }, 404);
    return true;
  } catch (error: any) {
    console.error('API Error:', error);
    sendJson({ error: error.message || 'Internal Server Error' }, 500);
    return true;
  }
}
