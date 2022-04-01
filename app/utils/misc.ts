export function getRequiredEnvVar(key: string, env = process.env): string {
  if (key in env && typeof env[key] === 'string') {
    return env[key] ?? ''
  }

  throw new Error(`Environment variable ${key} is not defined`)
}
