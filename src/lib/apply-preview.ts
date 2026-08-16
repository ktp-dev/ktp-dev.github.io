export type ApplyPreviewQuery = {
  preview?: string
  cycle?: string
}

export function parseApplyPreview(params: ApplyPreviewQuery) {
  const cycleId = params.cycle?.trim() ?? ''
  const looksLikeId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    cycleId
  )
  return {
    preview: params.preview === '1',
    cycleId: looksLikeId ? cycleId : undefined,
  }
}

export function applyPreviewHref(path: string, cycleId?: string | null) {
  const params = new URLSearchParams({ preview: '1' })
  if (cycleId) params.set('cycle', cycleId)
  return `${path}?${params.toString()}`
}
