# SAGA Cofounder - speak Claude Code's latest reply aloud (Windows TTS, free).
# Wired as a Stop hook. Reads the hook JSON on stdin, pulls the last assistant
# TEXT from the transcript (skipping tool calls), cleans it (strips code/markdown),
# caps the length, de-dupes, and speaks it with System.Speech.
#
# Mute:   delete  voice/voice-out.on   (un-mute: recreate it, any contents)
# Test:   echo '{"transcript_path":"<path.jsonl>"}' | powershell -File speak-response.ps1 -Print
# Never blocks or breaks the turn - always exits 0.
# NOTE: this file is intentionally ASCII-only. Windows PowerShell 5.1 reads
# BOM-less files as ANSI and corrupts non-ASCII literals, so non-ASCII text is
# handled by character code (0x....), never by literal glyphs.

param(
  [switch]$Print,        # print cleaned text instead of speaking (for testing)
  [string]$Transcript    # use this transcript path instead of reading stdin (for testing)
)

$ErrorActionPreference = 'Stop'
try {
  $here = $PSScriptRoot
  if (-not $here) { $here = Split-Path -Parent $MyInvocation.MyCommand.Path }
  $flag = Join-Path $here 'voice-out.on'

  # mute toggle (ignored when -Print testing)
  if (-not $Print -and -not (Test-Path $flag)) { exit 0 }

  # --- resolve transcript path (arg for tests, else stdin hook payload) ---
  $tpath = $Transcript
  if (-not $tpath) {
    $raw = [Console]::In.ReadToEnd()
    if ($raw) { try { $tpath = ($raw | ConvertFrom-Json).transcript_path } catch {} }
  }
  if (-not $tpath -or -not (Test-Path $tpath)) { exit 0 }

  # --- last assistant message that actually has text blocks ---
  $lines = Get-Content -LiteralPath $tpath -Encoding UTF8
  $text = $null
  for ($k = $lines.Count - 1; $k -ge 0; $k--) {
    $o = $null
    try { $o = $lines[$k] | ConvertFrom-Json } catch { continue }
    if ($o.type -eq 'assistant' -or $o.message.role -eq 'assistant') {
      $parts = @()
      if ($o.message.content -is [string]) { $parts += $o.message.content }
      elseif ($o.message.content) {
        foreach ($b in $o.message.content) { if ($b.type -eq 'text' -and $b.text) { $parts += $b.text } }
      }
      if ($parts.Count -gt 0) { $text = ($parts -join "`n"); break }
    }
  }
  if (-not $text) { exit 0 }

  # --- strip code / markdown (ASCII patterns only) ---
  $t = $text
  $t = [regex]::Replace($t, '(?s)```.*?```', ' ')                         # fenced code blocks
  $t = $t -replace '`', ''                                                # stray backticks
  $t = [regex]::Replace($t, '\[([^\]]+)\]\([^)]+\)', '$1')               # [text](url) -> text
  $t = [regex]::Replace($t, 'https?://\S+', '')                          # bare urls
  $t = [regex]::Replace($t, '(?m)^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+', '') # headings / lists / quotes
  $t = $t -replace '\|', ' '                                              # table pipes
  $t = $t -replace '[*_~]', ''                                            # bold / italic / strike

  # --- normalize/strip non-ASCII by char code (smart quotes, dashes, emoji) ---
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $t.ToCharArray()) {
    $code = [int]$ch
    if     ($code -lt 128)                       { [void]$sb.Append($ch) }      # plain ASCII
    elseif ($code -eq 0x2018 -or $code -eq 0x2019) {  }                          # curly apostrophes -> drop (keep contractions)
    elseif ($code -eq 0x201C -or $code -eq 0x201D) { [void]$sb.Append('"') }     # curly double quotes
    elseif ($code -ge 0x2013 -and $code -le 0x2015) { [void]$sb.Append(' - ') }  # en / em dash
    elseif ($code -eq 0x2026)                    { [void]$sb.Append('...') }     # ellipsis
    else                                         { [void]$sb.Append(' ') }       # emoji / arrows / symbols / CJK
  }
  $t = $sb.ToString()
  $t = ([regex]::Replace($t, '\s+', ' ')).Trim()
  if ($t.Length -lt 2) { exit 0 }

  # cap near 700 chars, preferring a sentence boundary
  $cap = 700
  if ($t.Length -gt $cap) {
    $slice = $t.Substring(0, $cap)
    $cut = [Math]::Max($slice.LastIndexOf('. '), [Math]::Max($slice.LastIndexOf('! '), $slice.LastIndexOf('? ')))
    if ($cut -gt 200) { $t = $slice.Substring(0, $cut + 1) } else { $t = $slice.Trim() }
  }

  if ($Print) { Write-Output $t; exit 0 }

  # --- de-dupe: Stop also fires on clear/resume/compact; don't repeat the same reply ---
  $state = Join-Path $env:TEMP 'saga-voice'
  New-Item -ItemType Directory -Force -Path $state | Out-Null
  $hashFile = Join-Path $state 'last.hash'
  $pidFile  = Join-Path $state 'speaker.pid'
  $sha = [System.BitConverter]::ToString(
    (New-Object System.Security.Cryptography.SHA1Managed).ComputeHash([Text.Encoding]::UTF8.GetBytes($t)))
  if ((Test-Path $hashFile) -and ((Get-Content -Raw $hashFile).Trim() -eq $sha)) { exit 0 }
  Set-Content -LiteralPath $hashFile -Value $sha -Encoding ASCII

  # --- barge-in: stop any reply still being spoken ---
  if (Test-Path $pidFile) {
    $old = (Get-Content -Raw $pidFile).Trim()
    if ($old) { try { Stop-Process -Id ([int]$old) -Force -ErrorAction SilentlyContinue } catch {} }
  }
  Set-Content -LiteralPath $pidFile -Value $PID -Encoding ASCII

  # --- speak ---
  Add-Type -AssemblyName System.Speech
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  try {
    $v = $synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -like 'en*' } | Select-Object -First 1
    if ($v) { $synth.SelectVoice($v.VoiceInfo.Name) }
  } catch {}
  $synth.Rate = 1
  $synth.Speak($t)
  $synth.Dispose()
  exit 0
}
catch { exit 0 }   # never break the turn
