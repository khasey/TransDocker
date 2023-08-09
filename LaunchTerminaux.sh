#!/bin/bash

# obtenir le chemin du script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# détecter le système d'exploitation
OS="$(uname)"

# ouvrir les terminaux en fonction du système d'exploitation
case "$OS" in
  "Linux")
    # utilisation de gnome-terminal comme exemple pour Linux
    gnome-terminal --working-directory="$DIR/transcendence_backend"
    gnome-terminal --working-directory="$DIR/transcendence_backend/src/server"
    gnome-terminal --working-directory="$DIR/transcendence_frontend"
    ;;
  "Darwin")
    # utilisation de open -a Terminal comme exemple pour Mac
    open -a Terminal "$DIR/transcendence_backend"
    open -a Terminal "$DIR/transcendence_backend/src/server"
    open -a Terminal "$DIR/transcendence_frontend"
    ;;
  "MINGW"*|"CYGWIN"*)
    # utilisation de start pour Windows
    # convertir le chemin pour qu'il soit compatible avec PowerShell
    PWD_FOR_WIN=$(echo $DIR | sed 's/^\/\([a-z]\)\//\1:\\\//' | sed 's/\//\\/g')
    start powershell -noexit -command "cd '$PWD_FOR_WIN\\transcendence_backend'"
    start powershell -noexit -command "cd '$PWD_FOR_WIN\\transcendence_backend\\src\\game'"
    start powershell -noexit -command "cd '$PWD_FOR_WIN\\transcendence_frontend'"
    ;;
  *)
    echo "OS not recognized"
    exit 1
    ;;
esac
