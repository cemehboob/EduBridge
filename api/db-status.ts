import postgres from 'postgres';

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

  let appLoadError: any = null;
  try {
    const appModule = await import('./_app.js');
    appLoadError = 'loaded ./_app.js successfully, serverApp is ' + typeof appModule.serverApp;
  } catch (e: any) {
    appLoadError = { message: e.message, stack: e.stack };
  }

  let filesInTask: string[] = [];
  let filesInServer: string[] = [];
  let filesInApi: string[] = [];
  try {
    const fs = await import('fs');
    filesInTask = fs.readdirSync('/var/task');
    if (fs.existsSync('/var/task/server')) {
      filesInServer = fs.readdirSync('/var/task/server');
    }
    if (fs.existsSync('/var/task/api')) {
      filesInApi = fs.readdirSync('/var/task/api');
    }
  } catch (e: any) {
    filesInTask = ['error: ' + e.message];
  }

  const sql = postgres(dbUrl, { ssl: 'require', max: 5, idle_timeout: 10 });
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const usersCount = await sql`SELECT count(*) FROM users`;
    const activitiesCount = await sql`SELECT count(*) FROM activities`;
    let otpsCount = 0;
    try {
      const otpsRes = await sql`SELECT count(*) FROM auth_otps`;
      otpsCount = parseInt(otpsRes[0]?.count || '0', 10);
    } catch {}

    return sendJson(res, 200, {
      success: true,
      configured: true,
      databaseProvider: 'Prisma Postgres',
      host: maskedHost,
      totalTables: tables.length,
      tables: tables.map((t: any) => t.table_name),
      userCount: parseInt(usersCount[0]?.count || '0', 10),
      activityCount: parseInt(activitiesCount[0]?.count || '0', 10),
      otpsCount,
      appLoadError,
      filesInTask,
      filesInServer,
      filesInApi,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return sendJson(res, 200, {
      success: false,
      configured: true,
      databaseProvider: 'Prisma Postgres',
      host: maskedHost,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    await sql.end({ timeout: 5 }).catch(() => {});
  }
}
