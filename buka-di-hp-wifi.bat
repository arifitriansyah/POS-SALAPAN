@echo off
title Server POS Salapan untuk HP
echo Memulai server lokal POS Salapan...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
