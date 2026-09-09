import 'server-only'

import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const PRESIGN_EXPIRES_SECONDS = 300

type S3Env = {
  region: string
  bucket: string
  client: S3Client
}

function readS3Env(): S3Env | null {
  const region = process.env.AWS_REGION?.trim()
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim()
  const bucket = process.env.S3_BUCKET?.trim()

  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    return null
  }

  return {
    region,
    bucket,
    client: new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    }),
  }
}

export function getS3ConfigStatus() {
  const env = readS3Env()
  if (!env) {
    return { configured: false as const, bucket: null, region: null }
  }
  return { configured: true as const, bucket: env.bucket, region: env.region }
}

export async function createPresignedPutUrl(input: {
  key: string
  contentType: string
  expiresInSeconds?: number
}) {
  const env = readS3Env()
  if (!env) {
    return { error: 'S3 is not configured (check AWS env vars).' as const, uploadUrl: null }
  }

  const command = new PutObjectCommand({
    Bucket: env.bucket,
    Key: input.key,
    ContentType: input.contentType,
  })

  const uploadUrl = await getSignedUrl(env.client, command, {
    expiresIn: input.expiresInSeconds ?? PRESIGN_EXPIRES_SECONDS,
  })

  return { error: null, uploadUrl, bucket: env.bucket }
}

function contentDisposition(filename: string, disposition: 'attachment' | 'inline') {
  const trimmed = filename.trim() || 'download'
  const ascii = trimmed.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_') || 'download'
  return `${disposition}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(trimmed)}`
}

export async function createPresignedGetUrl(input: {
  key: string
  filename: string
  contentType?: string | null
  expiresInSeconds?: number
  /** attachment = force download; inline = browser can display (PDF iframe). */
  disposition?: 'attachment' | 'inline'
}) {
  const env = readS3Env()
  if (!env) {
    return { error: 'S3 is not configured (check AWS env vars).' as const, downloadUrl: null }
  }

  const disposition = input.disposition ?? 'attachment'
  const command = new GetObjectCommand({
    Bucket: env.bucket,
    Key: input.key,
    ResponseContentDisposition: contentDisposition(input.filename, disposition),
    ...(input.contentType
      ? { ResponseContentType: input.contentType }
      : disposition === 'inline'
        ? { ResponseContentType: 'application/pdf' }
        : {}),
  })

  const downloadUrl = await getSignedUrl(env.client, command, {
    expiresIn: input.expiresInSeconds ?? PRESIGN_EXPIRES_SECONDS,
  })

  return { error: null, downloadUrl }
}

export async function headS3Object(key: string) {
  const env = readS3Env()
  if (!env) {
    return { error: 'S3 is not configured (check AWS env vars).' as const, object: null }
  }

  try {
    const result = await env.client.send(
      new HeadObjectCommand({
        Bucket: env.bucket,
        Key: key,
      })
    )

    return {
      error: null,
      object: {
        key,
        bucket: env.bucket,
        contentType: result.ContentType ?? null,
        sizeBytes: result.ContentLength ?? null,
        etag: result.ETag ?? null,
        lastModified: result.LastModified?.toISOString() ?? null,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Object not found'
    return { error: message, object: null }
  }
}

export async function deleteS3Object(key: string) {
  const env = readS3Env()
  if (!env) {
    return { error: 'S3 is not configured (check AWS env vars).' as const }
  }

  try {
    await env.client.send(
      new DeleteObjectCommand({
        Bucket: env.bucket,
        Key: key,
      })
    )
    return { error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed'
    return { error: message }
  }
}
