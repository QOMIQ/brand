@echo off
rem Export SVG podkladu pro socialni site do PNG (docs/socialni-site.md).
node "%~dp0scripts\render-social.mjs" %*
