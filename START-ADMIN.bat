@echo off
REM ====== Mo cong cu quan ly Cao Bang Map ======
REM Nhay doi (double-click) file nay de chay.
cd /d "%~dp0"
echo Dang khoi dong admin server...
start "" http://127.0.0.1:4173/admin/
node admin\server.js
pause
