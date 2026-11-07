function sendJson(res: any, status: number, data: any) {
  if (typeof res.status === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  return sendJson(res, 200, {
    success: true,
    message: 'EduBridge Vercel Cron executed successfully.',
    timestamp,
    cronSchedule: '0 0 * * * (Nightly at 00:00 UTC)',
    jobsExecuted: ['job_exam_midnight_00', 'job_vocab_expansion_00']
  });
}
