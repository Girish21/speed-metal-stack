export function getRequiredEnvVar(key: string, env = process.env): string {
  if (key in env && typeof env[key] === 'string') {
    return env[key] ?? ''
  }

  throw new Error(`Environment variable ${key} is not defined`)
}

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}
