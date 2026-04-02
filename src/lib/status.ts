export function dbToUi(status: string): string {
  return status.replace(/_/g, '-')
}

export function uiToDb(status: string): string {
  return status.replace(/-/g, '_')
}
