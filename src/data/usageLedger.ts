export interface UsageRecord {
  timestampUtc: string  // ISO 8601, e.g. "2026-06-29T08:14:00Z"
  model: string
  requestType: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  status: 'Success' | 'Error'
}

export interface DailyBucket {
  dateUtc: string  // "2026-06-23" — UTC calendar date
  tokens: number
}

export interface ProjectUsage {
  projectId: string
  totalDonated: number
  tokensUsed: number
  tokensRemaining: number
  modelBreakdown: { model: string; tokens: number; cost: number }[]
  dailyUsage: DailyBucket[]  // 7 entries, UTC dates, most recent last
  recentRequests: UsageRecord[]
  donors: { name: string; amount: number; anonymous: boolean }[]
}

/** Formats a UTC date string ("2026-06-23") to local-time display ("Jun 23"). */
export function formatBucketDate(dateUtc: string): string {
  return new Date(dateUtc + 'T00:00:00Z').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/** Formats an ISO timestamp ("2026-06-29T08:14:00Z") to local-time display ("Jun 29"). */
export function formatTimestamp(timestampUtc: string): string {
  return new Date(timestampUtc).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const navisightUsage: ProjectUsage = {
  projectId: 'navisight',
  totalDonated: 30,
  tokensUsed: 420_000,
  tokensRemaining: 1_080_000,
  modelBreakdown: [
    { model: 'GPT-4o Vision', tokens: 320_000, cost: 8.4 },
    { model: 'GPT-4o mini', tokens: 90_000, cost: 1.2 },
    { model: 'Embeddings', tokens: 10_000, cost: 0.1 },
  ],
  dailyUsage: [
    { dateUtc: '2026-06-23', tokens: 38_000 },
    { dateUtc: '2026-06-24', tokens: 55_000 },
    { dateUtc: '2026-06-25', tokens: 72_000 },
    { dateUtc: '2026-06-26', tokens: 44_000 },
    { dateUtc: '2026-06-27', tokens: 91_000 },
    { dateUtc: '2026-06-28', tokens: 80_000 },
    { dateUtc: '2026-06-29', tokens: 40_000 },
  ],
  recentRequests: [
    {
      timestampUtc: '2026-06-29T08:14:00Z',
      model: 'GPT-4o Vision',
      requestType: 'Image recognition',
      inputTokens: 15_200,
      outputTokens: 3_200,
      totalTokens: 18_400,
      estimatedCost: 0.42,
      status: 'Success',
    },
    {
      timestampUtc: '2026-06-29T07:52:00Z',
      model: 'GPT-4o mini',
      requestType: 'Prompt refinement',
      inputTokens: 2_400,
      outputTokens: 800,
      totalTokens: 3_200,
      estimatedCost: 0.01,
      status: 'Success',
    },
    {
      timestampUtc: '2026-06-28T21:30:00Z',
      model: 'GPT-4o Vision',
      requestType: 'Object detection',
      inputTokens: 14_000,
      outputTokens: 2_800,
      totalTokens: 16_800,
      estimatedCost: 0.38,
      status: 'Success',
    },
    {
      timestampUtc: '2026-06-28T18:11:00Z',
      model: 'Embeddings',
      requestType: 'Scene indexing',
      inputTokens: 9_600,
      outputTokens: 400,
      totalTokens: 10_000,
      estimatedCost: 0.1,
      status: 'Success',
    },
    {
      timestampUtc: '2026-06-27T14:04:00Z',
      model: 'GPT-4o Vision',
      requestType: 'Depth estimation',
      inputTokens: 16_000,
      outputTokens: 3_600,
      totalTokens: 19_600,
      estimatedCost: 0.45,
      status: 'Error',
    },
    {
      timestampUtc: '2026-06-27T09:45:00Z',
      model: 'GPT-4o mini',
      requestType: 'Label generation',
      inputTokens: 3_100,
      outputTokens: 900,
      totalTokens: 4_000,
      estimatedCost: 0.01,
      status: 'Success',
    },
  ],
  donors: [
    { name: 'Sarah', amount: 20, anonymous: false },
    { name: '', amount: 10, anonymous: true },
  ],
}

const usageLedger: Record<string, ProjectUsage> = {
  navisight: navisightUsage,
}

export function getProjectUsage(projectId: string): ProjectUsage | undefined {
  return usageLedger[projectId]
}
