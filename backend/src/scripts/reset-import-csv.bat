@echo off
setlocal

:: Se déplacer dans le dossier du backend
cd /d "%~dp0\..\.."

:: Informations
echo ======================================
echo = RESET ET IMPORT COMPLET DES PARFUMS =
echo ======================================
echo.
echo ATTENTION! Ce script va:
echo 1. SUPPRIMER TOUTES LES DONNÉES des parfums existants
echo 2. Créer de nouveaux parfums à partir du CSV avec leurs variantes
echo.
echo Avant de continuer, assurez-vous que:
echo - Le fichier CSV est situé dans: "Dossier perso - assist/Fiche produits tout contenant tout prix.csv"
echo - Le serveur MongoDB est en cours d'exécution
echo - Vous avez une sauvegarde des données si nécessaire
echo.
echo CETTE ACTION NE PEUT PAS ÊTRE ANNULÉE!
echo.
echo Appuyez sur une touche pour continuer ou fermez cette fenêtre pour annuler...
pause > nul

:: Vérification de l'existence du fichier CSV
if not exist "..\..\Dossier perso - assist\Fiche produits tout contenant tout prix.csv" (
  echo.
  echo ERREUR: Le fichier CSV n'a pas été trouvé.
  echo Veuillez vérifier que le fichier est présent dans le dossier:
  echo "Dossier perso - assist/Fiche produits tout contenant tout prix.csv"
  echo.
  goto :fin
)

:: Demander une confirmation supplémentaire
echo.
echo DERNIÈRE CHANCE: Êtes-vous sûr de vouloir supprimer TOUTES les données parfums?
echo Tapez "CONFIRMER" (en majuscules) pour continuer:
set /p confirmation=

if not "%confirmation%"=="CONFIRMER" (
  echo.
  echo Opération annulée.
  goto :fin
)

:: Compiler et exécuter le script TypeScript
echo.
echo Compilation et exécution du script de réinitialisation et importation...
echo.
call npx ts-node src/scripts/reset-import-csv.ts

echo.
echo Pour vérifier l'importation, exécutez:
echo npx ts-node src/scripts/verify-import-csv.ts
echo.

:fin
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul 