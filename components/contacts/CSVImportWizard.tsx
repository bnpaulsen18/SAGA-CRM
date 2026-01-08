'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import ColumnMapper from './ColumnMapper'
import ImportPreview from './ImportPreview'
import { importContacts } from '@/app/actions/contacts'
import { Check } from '@phosphor-icons/react'

type CSVRow = Record<string, string>

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete'

export default function CSVImportWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{
    success: number
    failed: number
    duplicates: number
    errors: string[]
  } | null>(null)

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV parsing error: ${results.errors[0].message}`)
          return
        }

        const data = results.data as CSVRow[]
        const headers = results.meta.fields || []

        if (data.length === 0) {
          setError('CSV file is empty')
          return
        }

        if (data.length > 5000) {
          setError('CSV file too large. Maximum 5,000 rows allowed.')
          return
        }

        setCsvData(data)
        setCsvHeaders(headers)
        setStep('mapping')
      },
      error: (error) => {
        setError(`Failed to read CSV: ${error.message}`)
      }
    })
  }

  function handleMappingComplete(mapping: Record<string, string>) {
    setColumnMapping(mapping)
    setStep('preview')
  }

  async function handleImport() {
    setStep('importing')
    setError(null)
    setImportProgress(0)

    try {
      // Transform CSV data using column mapping
      const mappedData = csvData.map(row => {
        const contact: any = {}

        Object.entries(columnMapping).forEach(([csvColumn, contactField]) => {
          if (csvColumn && contactField) {
            let value = row[csvColumn]?.trim()

            // Handle tags (comma-separated)
            if (contactField === 'tags' && value) {
              contact.tags = value.split(',').map(t => t.trim()).filter(Boolean)
            } else if (value) {
              contact[contactField] = value
            }
          }
        })

        return contact
      })

      // Call server action to import
      const result = await importContacts(mappedData)

      setImportResult(result)
      setStep('complete')

      if (result.success > 0) {
        // Small delay then redirect to contacts page
        setTimeout(() => {
          router.push('/contacts')
        }, 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setStep('preview')
    }
  }

  function resetWizard() {
    setStep('upload')
    setCsvData([])
    setCsvHeaders([])
    setColumnMapping({})
    setFileName('')
    setError(null)
    setImportProgress(0)
    setImportResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        <StepIndicator label="1. Upload" active={step === 'upload'} completed={['mapping', 'preview', 'importing', 'complete'].includes(step)} />
        <div className="h-[2px] w-16 bg-white/20"></div>
        <StepIndicator label="2. Map Columns" active={step === 'mapping'} completed={['preview', 'importing', 'complete'].includes(step)} />
        <div className="h-[2px] w-16 bg-white/20"></div>
        <StepIndicator label="3. Preview" active={step === 'preview'} completed={['importing', 'complete'].includes(step)} />
        <div className="h-[2px] w-16 bg-white/20"></div>
        <StepIndicator label="4. Import" active={step === 'importing' || step === 'complete'} completed={step === 'complete'} />
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444'
          }}
        >
          {error}
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <SagaCard title="Step 1: Upload CSV File">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center transition-colors"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg text-white mb-2">Click to upload CSV file</p>
                <p className="text-sm text-white/60">or drag and drop</p>
                <p className="text-xs text-white/40 mt-4">Maximum 5,000 rows</p>
              </label>
            </div>

            {fileName && (
              <p className="text-white/70 text-sm">
                Selected: <span className="text-white font-medium">{fileName}</span>
              </p>
            )}
          </div>
        </SagaCard>
      )}

      {/* Step 2: Column Mapping */}
      {step === 'mapping' && (
        <ColumnMapper
          csvHeaders={csvHeaders}
          onComplete={handleMappingComplete}
          onBack={() => setStep('upload')}
        />
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <ImportPreview
          csvData={csvData}
          columnMapping={columnMapping}
          onImport={handleImport}
          onBack={() => setStep('mapping')}
        />
      )}

      {/* Step 4: Importing */}
      {step === 'importing' && (
        <SagaCard title="⏳ Importing Contacts...">
          <div className="space-y-4">
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${importProgress}%`,
                  background: 'linear-gradient(to right, #764ba2, #ff6b35)'
                }}
              ></div>
            </div>
            <p className="text-center text-white/70">
              Processing {csvData.length} contacts...
            </p>
          </div>
        </SagaCard>
      )}

      {/* Step 5: Complete */}
      {step === 'complete' && importResult && (
        <SagaCard title="✅ Import Complete">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <div className="text-3xl font-bold text-green-400">{importResult.success}</div>
                <div className="text-sm text-white/70 mt-1">Imported</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <div className="text-3xl font-bold text-yellow-400">{importResult.duplicates}</div>
                <div className="text-sm text-white/70 mt-1">Duplicates Skipped</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div className="text-3xl font-bold text-red-400">{importResult.failed}</div>
                <div className="text-sm text-white/70 mt-1">Failed</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Errors:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {importResult.errors.map((error, i) => (
                    <div key={i} className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push('/contacts')}
                className="flex-1 text-white font-semibold"
                style={{
                  background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                  border: 'none'
                }}
              >
                View Contacts
              </Button>
              <Button
                onClick={resetWizard}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Import More
              </Button>
            </div>

            <p className="text-center text-white/60 text-sm">
              Redirecting to contacts in 3 seconds...
            </p>
          </div>
        </SagaCard>
      )}
    </div>
  )
}

function StepIndicator({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
        style={{
          background: completed
            ? 'linear-gradient(to right, #764ba2, #ff6b35)'
            : active
            ? 'rgba(255, 107, 53, 0.3)'
            : 'rgba(255, 255, 255, 0.1)',
          border: active ? '2px solid #ff6b35' : '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}
      >
        {completed ? <Check size={18} weight="bold" /> : label.split('.')[0]}
      </div>
      <span className="text-xs text-white/70 mt-2 whitespace-nowrap">{label.split('. ')[1]}</span>
    </div>
  )
}
