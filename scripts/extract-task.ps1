$file = "C:\Users\dalej\.gemini\antigravity-ide\brain\90ff4127-e828-416b-b0a4-166c3c576b07\.system_generated\logs\transcript_full.jsonl"
$line = Get-Content $file -Head 1
$text = $line -join ""
$idx = $text.IndexOf("Task 3 ")
# Search for "Task 3" as a task heading rather than an inline reference
$searchFrom = 0
while ($idx -ge 0) {
    $context = $text.Substring([Math]::Max(0, $idx - 20), [Math]::Min(40, $text.Length - [Math]::Max(0, $idx - 20)))
    if ($context -match "\\nTask 3 " -or $context -match "Task 3 \\xe2" -or $context -match "Task 3 \\u2014") {
        $len = [Math]::Min(3000, $text.Length - $idx)
        Write-Output $text.Substring($idx, $len)
        break
    }
    $searchFrom = $idx + 7
    $idx = $text.IndexOf("Task 3 ", $searchFrom)
}
if ($idx -lt 0) {
    # Try broader search
    $idx = $text.IndexOf("Task 3")
    while ($idx -ge 0) {
        $prevChar = ""
        if ($idx -gt 0) { $prevChar = $text.Substring($idx - 1, 1) }
        if ($prevChar -eq "`n" -or $prevChar -eq "\") {
            $len = [Math]::Min(3000, $text.Length - $idx)
            Write-Output $text.Substring($idx, $len)
            break
        }
        $idx = $text.IndexOf("Task 3", $idx + 6)
    }
}
