import { serverApp } from '../server/app';

export default function handler(req: any, res: any) {
  return serverApp(req, res);
}
