#!/bin/bash
# scripts/start.sh

# -------------------------------
# Script pour démarrer Octavio AI WhatsApp
# -------------------------------

echo "🚀 Démarrage du serveur Octavio AI..."

# Vérifie si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé. Installe-le d'abord."
    exit
fi

# Vérifie si npm est installé
if ! command -v npm &> /dev/null
then
    echo "❌ npm n'est pas installé. Installe-le d'abord."
    exit
fi

# Installe les dépendances si pas encore fait
echo "📦 Installation des dépendances..."
npm install

# Démarre le serveur et le bot
echo "🤖 Lancement du serveur et du bot WhatsApp..."
node api/server.js
