'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import SagaCard from '@/components/ui/saga-card'
import { Check, Warning } from '@phosphor-icons/react'

interface ImportPreviewProps {
  csvData: Record<string, string>[]
  columnMapping: Record<string, string>
  onImport: () => void
  onBack: () => void
}

export default function ImportPreview({
  csvData,
  columnMapping,
  onImport,
  onBack
}: ImportPreviewProps) {
  const { previewData, validationStats } = useMemo(() => {
    const mapped = csvData.map((row, index) => {
      const contact: any = { _rowNumber: index + 1 }
      const errors: string[] = []

      Object.entries(columnMapping).forEach(([csvColumn, contactField]) => {
        if (csvColumn && contactField) {
          const value = row[csvColumn]?.trim()

          if (contactField === 'tags' && value) {
            contact.tags = value.split(',').map(t => t.trim()).filter(Boolean)
          } else if (value) {
            contact[contactField] = value
          }
        }
      })

      // Validation
      if (!contact.firstName) {
        errors.push('Missing first name')
      }
      if (!contact.lastName) {
        errors.push('Missing last name')
      }
      if (!contact.email) {
        errors.push('Missing email')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errors.push('Invalid email format')
      }

      contact._errors = errors
      contact._isValid = errors.length === 0

      return contact
    })

    const stats = {
      total: mapped.length,
      valid: mapped.filter(c => c._isValid).length,
      invalid: mapped.filter(c => !c._isValid).length
    }

    return {
      previewData: mapped.slice(0, 10), // Show first 10 rows
      validationStats: stats
    }
  }, [csvData, columnMapping])

  const canImport = validationStats.valid > 0

  return (
    <SagaCard title="👀 Step 3: Preview & Validate">
      <div className="space-y-6">
        {/* Validation Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="text-2xl font-bold text-white">{validationStats.total}</div>
            <div className="text-sm text-white/70 mt-1">Total Rows</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div className="text-2xl font-bold text-green-400">{validationStats.valid}</div>
            <div className="text-sm text-white/70 mt-1">Valid</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div className="text-2xl font-bold text-red-400">{validationStats.invalid}</div>
            <div className="text-sm text-white/70 mt-1">Invalid</div>
          </div>
        </div>

        {/* Preview Table */}
        <div>
          <h4 className="text-white font-medium mb-3">Preview (first 10 rows):</h4>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left text-white/70 font-medium">#</th>
                  <th className="px-3 py-2 text-left text-white/70 font-medium">Name</th>
                  <th className="px-3 py-2 text-left text-white/70 font-medium">Email</th>
                  <th className="px-3 py-2 text-left text-white/70 font-medium">Phone</th>
                  <th className="px-3 py-2 text-left text-white/70 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {previewData.map((contact, i) => (
                  <tr key={i} className={contact._isValid ? '' : 'bg-red-400/5'}>
                    <td className="px-3 py-2 text-white/60">{contact._rowNumber}</td>
                    <td className="px-3 py-2">
                      {contact._isValid ? (
                        <span className="text-white">
                          {contact.firstName} {contact.lastName}
                        </span>
                      ) : (
                        <div>
                          <span className="text-white/50">
                            {contact.firstName || '?'} {contact.lastName || '?'}
                          </span>
                          <div className="text-xs text-red-400 mt-1">
                            {contact._errors.join(', ')}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-white/70">{contact.email || '-'}</td>
                    <td className="px-3 py-2 text-white/70">{contact.phone || '-'}</td>
                    <td className="px-3 py-2">
                      {contact._isValid ? (
                        <span className="text-green-400 text-xs flex items-center gap-1">
                          <Check size={14} weight="bold" />
                          Valid
                        </span>
                      ) : (
                        <span className="text-red-400 text-xs">✗ Invalid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning for invalid rows */}
        {validationStats.invalid > 0 && (
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)'
            }}
          >
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <Warning size={18} weight="bold" />
              {validationStats.invalid} row(s) have validation errors and will be skipped during import.
            </p>
          </div>
        )}

        {/* No valid rows warning */}
        {validationStats.valid === 0 && (
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            <p className="text-red-400 text-sm">
              ❌ No valid rows found. Please fix the errors and try again.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10"
          >
            ← Back to Mapping
          </Button>
          <Button
            onClick={onImport}
            disabled={!canImport}
            className="flex-1 text-white font-semibold"
            style={{
              background: canImport
                ? 'linear-gradient(to right, #764ba2, #ff6b35)'
                : 'rgba(118, 75, 162, 0.3)',
              border: 'none',
              opacity: canImport ? 1 : 0.5,
              cursor: canImport ? 'pointer' : 'not-allowed'
            }}
          >
            {canImport
              ? `Import ${validationStats.valid} Contact${validationStats.valid === 1 ? '' : 's'} →`
              : 'Cannot Import - No Valid Rows'}
          </Button>
        </div>
      </div>
    </SagaCard>
  )
}
