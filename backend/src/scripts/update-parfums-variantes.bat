@echo off

echo *********************************************
echo *   MISE A JOUR DES VARIANTES DE PARFUMS    *
echo *********************************************
echo.

echo Ce script va mettre à jour les variantes des parfums dans la base de données MongoDB
echo à partir du fichier CSV des produits.
echo.
echo ATTENTION: Assurez-vous que le fichier CSV est à jour et que MongoDB est en cours d'exécution.
echo.

:PROMPT
set /p CONTINUE=Voulez-vous continuer? (O/N): 
if /i "%CONTINUE%" EQU "O" goto CONTINUE
if /i "%CONTINUE%" EQU "N" goto END
goto PROMPT

:CONTINUE
echo.
echo Mise à jour des variantes en cours...
echo.

set NODE_ENV=development
cd ../../..
npx ts-node -r dotenv/config src/scripts/update-parfums-variantes.ts

echo.
echo Script terminé.
echo.

:END
pause 