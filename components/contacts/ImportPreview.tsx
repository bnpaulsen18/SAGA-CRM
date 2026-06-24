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

export default function ImportPreview({ csvData, columnMapping, onImport, onBack }: ImportPreviewProps) {
  const { previewData, validationStats } = useMemo(() => {
    const mapped = csvData.map((row, index) => {
      const contact: any = { _rowNumber: index + 1 }
      const errors: string[] = []
      Object.entries(columnMapping).forEach(([csvColumn, contactField]) => {
        if (csvColumn && contactField) {
          const value = row[csvColumn]?.trim()
          if (contactField === 'tags' && value) {
            contact.tags = value.split(',').map((t) => t.trim()).filter(Boolean)
          } else if (value) {
            contact[contactField] = value
          }
        }
      })
      if (!contact.firstName) errors.push('Missing first name')
      if (!contact.lastName) errors.push('Missing last name')
      if (!contact.email) errors.push('Missing email')
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.push('Invalid email format')
      contact._errors = errors
      contact._isValid = errors.length === 0
      return contact
    })
    const stats = {
      total: mapped.length,
      valid: mapped.filter((c) => c._isValid).length,
      invalid: mapped.filter((c) => !c._isValid).length,
    }
    return { previewData: mapped.slice(0, 10), validationStats: stats }
  }, [csvData, columnMapping])

  const canImport = validationStats.valid > 0

  return (
    <SagaCard title="👀 Step 3: Preview & Validate">
      <div className="space-y-6">
        {/* Validation Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-[var(--paper)] border border-[var(--line)]">
            <div className="text-2xl font-bold text-[var(--ink)] tabular-nums">{validationStats.total}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">Total Rows</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-[#E6F3EE] border border-[#CDE9DD]">
            <div className="text-2xl font-bold text-[#2E7D5B] tabular-nums">{validationStats.valid}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">Valid</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-[#F6EBE6] border border-[#EAD3C8]">
            <div className="text-2xl font-bold text-[#C0573F] tabular-nums">{validationStats.invalid}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">Invalid</div>
          </div>
        </div>

        {/* Preview Table */}
        <div>
          <h4 className="text-[var(--ink)] font-medium mb-3">Preview (first 10 rows):</h4>
          <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--paper)]">
                <tr>
                  <th className="px-3 py-2 text-left text-[var(--ink-soft)] font-medium">#</th>
                  <th className="px-3 py-2 text-left text-[var(--ink-soft)] font-medium">Name</th>
                  <th className="px-3 py-2 text-left text-[var(--ink-soft)] font-medium">Email</th>
                  <th className="px-3 py-2 text-left text-[var(--ink-soft)] font-medium">Phone</th>
                  <th className="px-3 py-2 text-left text-[var(--ink-soft)] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {previewData.map((contact, i) => (
                  <tr key={i} className={contact._isValid ? '' : 'bg-[#FBF1EE]'}>
                    <td className="px-3 py-2 text-[var(--ink-faint)]">{contact._rowNumber}</td>
                    <td className="px-3 py-2">
                      {contact._isValid ? (
                        <span className="text-[var(--ink)]">{contact.firstName} {contact.lastName}</span>
                      ) : (
                        <div>
                          <span className="text-[var(--ink-faint)]">{contact.firstName || '?'} {contact.lastName || '?'}</span>
                          <div className="text-xs text-[#C0573F] mt-1">{contact._errors.join(', ')}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[var(--ink-soft)]">{contact.email || '-'}</td>
                    <td className="px-3 py-2 text-[var(--ink-soft)]">{contact.phone || '-'}</td>
                    <td className="px-3 py-2">
                      {contact._isValid ? (
                        <span className="text-[#2E7D5B] text-xs flex items-center gap-1">
                          <Check size={14} weight="bold" />
                          Valid
                        </span>
                      ) : (
                        <span className="text-[#C0573F] text-xs">✗ Invalid</span>
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
          <div className="p-4 rounded-lg bg-[#F7EFD9] border border-[#ECD9A8]">
            <p className="text-[#B7791F] text-sm flex items-center gap-2">
              <Warning size={18} weight="bold" />
              {validationStats.invalid} row(s) have validation errors and will be skipped during import.
            </p>
          </div>
        )}

        {/* No valid rows warning */}
        {validationStats.valid === 0 && (
          <div className="p-4 rounded-lg bg-[#F6EBE6] border border-[#EAD3C8]">
            <p className="text-[#C0573F] text-sm">❌ No valid rows found. Please fix the errors and try again.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onBack} variant="outline" className="text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-2)]">
            ← Back to Mapping
          </Button>
          <Button
            onClick={onImport}
            disabled={!canImport}
            className="flex-1 text-white font-semibold border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
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
