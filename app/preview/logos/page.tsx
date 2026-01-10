/**
 * Logo Variations Preview Page
 * View all 5 SAGA logo variations in one place
 * Access at: /preview/logos
 */

import {
  SagaLogoPrimary,
  SagaLogoDark,
  SagaLogoLight,
  SagaIcon,
  SagaLogoCompact
} from '@/components/logos'

export const metadata = {
  title: 'SAGA CRM - Logo Variations',
  description: 'Preview all 5 professional logo variations',
}

export default function LogosPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SAGA CRM Logo System
          </h1>
          <p className="text-lg text-gray-600">
            5 professional variations for every use case
          </p>
        </div>

        {/* Variation 1: Primary Full Wordmark */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                1. Primary Full Wordmark
              </h2>
              <p className="text-gray-600 mb-4">
                Main website header, marketing materials, presentations
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Gradient
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  With Tagline
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  280x80
                </span>
              </div>
            </div>

            {/* Display */}
            <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl mb-6">
              <SagaLogoPrimary width={280} />
            </div>

            {/* Size Variations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-3">Small (200px)</p>
                <div className="flex items-center justify-center">
                  <SagaLogoPrimary width={200} />
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-3">Medium (250px)</p>
                <div className="flex items-center justify-center">
                  <SagaLogoPrimary width={250} />
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-3">Without Tagline</p>
                <div className="flex items-center justify-center">
                  <SagaLogoPrimary width={250} showTagline={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Variation 2: Monochrome Dark */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                2. Monochrome Dark
              </h2>
              <p className="text-gray-600 mb-4">
                Partner logo grids, print materials, light backgrounds
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Single Color
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Print Ready
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  WCAG AAA
                </span>
              </div>
            </div>

            {/* Display */}
            <div className="flex items-center justify-center py-12 bg-white border-2 border-gray-200 rounded-xl mb-6">
              <SagaLogoDark width={240} />
            </div>

            {/* Partner Grid Example */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-xs text-gray-600 mb-4 text-center">
                Partner Logo Grid Example
              </p>
              <div className="grid grid-cols-3 gap-6 items-center opacity-60">
                <div className="flex justify-center">
                  <SagaLogoDark width={160} showTagline={false} />
                </div>
                <div className="flex justify-center">
                  <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-600">Partner 1</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-600">Partner 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Variation 3: Monochrome Light */}
        <section className="mb-16">
          <div className="bg-[#0F1419] rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                3. Monochrome Light
              </h2>
              <p className="text-white/70 mb-4">
                Dark mode UI, dark backgrounds, video overlays
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                  White
                </span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                  Dark Mode
                </span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                  WCAG AA
                </span>
              </div>
            </div>

            {/* Display */}
            <div className="flex items-center justify-center py-12 bg-black/20 rounded-xl mb-6">
              <SagaLogoLight width={240} />
            </div>

            {/* Dark Theme Example */}
            <div className="bg-black/30 rounded-xl p-6">
              <p className="text-xs text-white/60 mb-4 text-center">
                Dark Theme Navigation Example
              </p>
              <div className="flex items-center justify-between">
                <SagaLogoLight width={180} showTagline={false} />
                <div className="flex gap-6">
                  <button className="text-white/70 hover:text-white text-sm">Features</button>
                  <button className="text-white/70 hover:text-white text-sm">Pricing</button>
                  <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Variation 4: Icon Only */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                4. Icon Only (Square)
              </h2>
              <p className="text-gray-600 mb-4">
                Favicon, app icons, social media avatars, profile pictures
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  64x64
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  2 Variants
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Scalable
                </span>
              </div>
            </div>

            {/* Display */}
            <div className="flex items-center justify-center gap-12 py-12 bg-gray-50 rounded-xl mb-6">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">Gradient (Default)</p>
                <SagaIcon size={128} variant="gradient" />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">Flat (Tiny Sizes)</p>
                <SagaIcon size={128} variant="flat" />
              </div>
            </div>

            {/* Size Scale */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-xs text-gray-600 mb-4 text-center">
                Size Scale (16px to 180px)
              </p>
              <div className="flex items-end justify-center gap-8">
                <div className="text-center">
                  <SagaIcon size={16} variant="flat" />
                  <p className="text-xs text-gray-500 mt-2">16px<br/>Favicon</p>
                </div>
                <div className="text-center">
                  <SagaIcon size={32} variant="flat" />
                  <p className="text-xs text-gray-500 mt-2">32px<br/>Browser</p>
                </div>
                <div className="text-center">
                  <SagaIcon size={64} variant="gradient" />
                  <p className="text-xs text-gray-500 mt-2">64px<br/>Avatar</p>
                </div>
                <div className="text-center">
                  <SagaIcon size={128} variant="gradient" />
                  <p className="text-xs text-gray-500 mt-2">128px<br/>App Icon</p>
                </div>
                <div className="text-center">
                  <SagaIcon size={180} variant="gradient" />
                  <p className="text-xs text-gray-500 mt-2">180px<br/>Apple Touch</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Variation 5: Compact Horizontal */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                5. Compact Horizontal
              </h2>
              <p className="text-gray-600 mb-4">
                Navigation bars, mobile headers, tight spaces
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  140x48
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Compact
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Mobile Ready
                </span>
              </div>
            </div>

            {/* Display */}
            <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl mb-6">
              <SagaLogoCompact width={140} />
            </div>

            {/* Responsive Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-3 text-center">Desktop (140px)</p>
                <div className="flex items-center justify-center bg-white rounded p-3">
                  <SagaLogoCompact width={140} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-3 text-center">Tablet (120px)</p>
                <div className="flex items-center justify-center bg-white rounded p-3">
                  <SagaLogoCompact width={120} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-3 text-center">Mobile (Icon Only)</p>
                <div className="flex items-center justify-center bg-white rounded p-3">
                  <SagaLogoCompact width={100} hideIcon={true} />
                </div>
              </div>
            </div>

            {/* Navigation Bar Example */}
            <div className="mt-6 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <SagaLogoCompact width={140} />
                <div className="flex gap-6 text-sm text-gray-700">
                  <a href="#" className="hover:text-gray-900">Features</a>
                  <a href="#" className="hover:text-gray-900">Pricing</a>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Quick Usage Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📦 Import</h3>
                <pre className="bg-black/20 rounded-lg p-3 text-sm overflow-x-auto">
{`import {
  SagaLogoPrimary,
  SagaIcon
} from '@/components/logos'`}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✨ Use</h3>
                <pre className="bg-black/20 rounded-lg p-3 text-sm overflow-x-auto">
{`<SagaLogoPrimary width={250} />
<SagaIcon size={64} />
<SagaLogoCompact width={140} />`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>See <a href="/LOGO-VARIATIONS.md" className="text-purple-600 hover:underline">LOGO-VARIATIONS.md</a> for complete documentation</p>
        </div>
      </div>
    </div>
  )
}
