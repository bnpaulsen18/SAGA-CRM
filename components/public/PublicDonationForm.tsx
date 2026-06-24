import { Heart } from '@phosphor-icons/react/dist/ssr'

interface PublicDonationFormProps {
  organizationId: string
  organizationName: string
  campaignId?: string
  campaignName?: string
  embedded?: boolean
}

/**
 * Online giving is intentionally disabled for now: there is no public (unauthenticated)
 * checkout endpoint yet, so the previous form posted to an auth-only route and could never
 * complete a donation. This renders a safe, on-brand placeholder so no broken donate flow
 * ships. When the public checkout is built, restore the interactive form here.
 */
export default function PublicDonationForm({
  organizationName,
  campaignName,
  embedded = false,
}: PublicDonationFormProps) {
  const containerClass = embedded
    ? 'max-w-2xl mx-auto p-6'
    : 'min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center'

  return (
    <div className={containerClass}>
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 mb-4">
          <Heart size={32} weight="fill" className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Support {organizationName}
        </h1>
        {campaignName && (
          <p className="text-white/70 text-lg mb-1">{campaignName}</p>
        )}
        <p className="text-white/70 mt-3">
          Online giving is launching soon. Thank you for supporting {organizationName} —
          please check back shortly to make your gift.
        </p>
      </div>
    </div>
  )
}
