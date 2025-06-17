@echo off
setlocal

:: Se déplacer dans le dossier du backend
cd /d "%~dp0\..\.."

:: Informations
echo ======================================
echo = VÉRIFICATION DES PARFUMS IMPORTÉS  =
echo ======================================
echo.
echo Ce script va:
echo 1. Se connecter à la base de données MongoDB
echo 2. Vérifier l'importation des parfums et de leurs variantes
echo.

:: Compiler et exécuter le script TypeScript
echo Exécution du script de vérification...
echo.
call npx ts-node src/scripts/verify-import-csv.ts

:fin
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul 