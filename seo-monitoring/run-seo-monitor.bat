@echo off
setlocal

chcp 65001 >nul

set "REPO=D:\Impulsive\Impulsive app & IOS & website\Impulsive-Website"
set "REPORTS=%REPO%\seo-monitoring\reports"

if not exist "%REPORTS%" mkdir "%REPORTS%"

for /f "delims=" %%I in ('%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%I"

set "REPORT=%REPORTS%\gsc-report-%STAMP%.md"

pushd "%REPO%" || exit /b 1

call "D:\AI-CLI\npm-global\claude.cmd" ^
  --no-session-persistence ^
  --add-dir "D:\AI-CLI\Claude-Config\plugins\cache\agricidaniel-claude-seo\claude-seo" ^
  --permission-mode dontAsk ^
  --allowedTools "Skill" "Read" "Glob" "Grep" "Bash(claude-seo *)" ^
  -p "/claude-seo:seo google gsc sc-domain:useimpulsive.com" ^
  > "%REPORT%" 2>&1

set "EXITCODE=%ERRORLEVEL%"

popd
exit /b %EXITCODE%
