export type CreatorIdeaStatus = 'fundraising' | 'funded' | 'draft'

export interface CreatorIdea {
  id: string
  name: string
  tagline: string
  description: string
  useCase: string
  goal: number
  raised: number
  availableBalance: number
  apiKeyPreview: string
  status: CreatorIdeaStatus
  lastDonation: {
    donor: string
    amount: number
    receivedAt: string
  }
  liveResponse: {
    model: string
    latencyMs: number
    message: string
  }
}

export const creatorIdeas: CreatorIdea[] = [
  {
    id: 'navisight',
    name: 'NaviSight',
    tagline: 'AI navigation for the visually impaired',
    description:
      'Real-time image recognition and voice guidance to help blind users navigate independently.',
    useCase: 'GPT-4o Vision',
    goal: 50,
    raised: 30,
    availableBalance: 30,
    apiKeyPreview: 'sk-fuelup-••••3a9',
    status: 'fundraising',
    lastDonation: {
      donor: 'Sarah',
      amount: 30,
      receivedAt: 'Just now',
    },
    liveResponse: {
      model: 'gpt-4o-mini',
      latencyMs: 812,
      message: 'Vision prompt accepted. Project key is active and ready for API calls.',
    },
  },
  {
    id: 'echonote',
    name: 'EchoNote',
    tagline: 'Voice notes that become structured project briefs',
    description:
      'A lightweight assistant that turns messy spoken notes into product specs, action items, and implementation prompts.',
    useCase: 'GPT-4o mini',
    goal: 40,
    raised: 5,
    availableBalance: 5,
    apiKeyPreview: 'sk-fuelup-••••8f2',
    status: 'fundraising',
    lastDonation: {
      donor: 'Maya',
      amount: 5,
      receivedAt: '2h ago',
    },
    liveResponse: {
      model: 'gpt-4o-mini',
      latencyMs: 640,
      message: 'Text generation key is active. Ready to process note transcripts.',
    },
  },
]

export function getCreatorIdea(id: string): CreatorIdea | undefined {
  return creatorIdeas.find((idea) => idea.id === id)
}

export function creatorFundingPercent(idea: CreatorIdea): number {
  if (idea.goal <= 0) return 0
  return Math.min(100, Math.round((idea.raised / idea.goal) * 100))
}

export function formatCurrency(usd: number): string {
  return `$${usd.toFixed(2)}`
}
