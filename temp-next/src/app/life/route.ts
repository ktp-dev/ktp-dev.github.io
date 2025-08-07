import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const indexPath = path.join(process.cwd(), 'public', 'life', 'index.html');
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
