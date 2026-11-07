import { neon } from '@neondatabase/serverless';

function sendJson(res: any, status: number, data: any) {
  if (typeof res.status === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return sendJson(res, 200, {
      success: false,
      configured: false,
      message: 'DATABASE_URL environment variable is NOT set in Vercel project settings.',
      vercelEnv: process.env.VERCEL_ENV || 'unknown'
    });
  }

  let maskedHost = 'unknown';
  try {
    const parts = dbUrl.split('@');
    if (parts[1]) {
      maskedHost = parts[1].split('/')[0];
    }
  } catch {}

  let filesInTask: string[] = [];
  let filesInServer: string[] = [];
  try {
    const fs = await import('fs');
    filesInTask = fs.readdirSync('/var/task');
    if (fs.existsSync('/var/task/server')) {
      filesInServer = fs.readdirSync('/var/task/server');
    }
  } catch (e: any) {
    filesInTask = ['error: ' + e.message];
  }

  try {
    const sql = neon(dbUrl);
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const usersCount = await sql`SELECT count(*) FROM users`;
    const activitiesCount = await sql`SELECT count(*) FROM activities`;

    return sendJson(res, 200, {
      success: true,
      configured: true,
      host: maskedHost,
      totalTables: tables.length,
      tables: tables.map((t: any) => t.table_name),
      userCount: parseInt(usersCount[0]?.count || '0', 10),
      activityCount: parseInt(activitiesCount[0]?.count || '0', 10),
      filesInTask,
      filesInServer,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return sendJson(res, 200, {
      success: false,
      configured: true,
      host: maskedHost,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}
