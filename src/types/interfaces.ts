export interface CommonStateInterface {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}