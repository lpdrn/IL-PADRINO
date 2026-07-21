@echo off
cd /d "%~dp0"

echo ============================================
echo   Push changes to GitHub / Vercel
echo ============================================
echo.

echo Checking code for errors...
call npm run typecheck
if errorlevel 1 (
    echo.
    echo ============================================
    echo ERROR: There is a mistake in the code.
    echo Fix it before pushing - the live site is safe,
    echo but this change will NOT go live until fixed.
    echo See the error message above.
    echo ============================================
    pause
    exit /b 1
)

echo.
echo Code looks good.
echo.

git add -A

set "msg="
set /p msg="Short description of your change (or press Enter to skip): "
if "%msg%"=="" set "msg=Update site content"

git commit -m "%msg%"
if errorlevel 1 (
    echo.
    echo Nothing new to push.
    pause
    exit /b 0
)

echo.
echo Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ============================================
    echo PUSH FAILED. Check your internet connection
    echo and try again.
    echo ============================================
    pause
    exit /b 1
)

echo.
echo ============================================
echo DONE! Vercel is deploying now.
echo The live site will update in 1-2 minutes.
echo ============================================
echo.
pause
