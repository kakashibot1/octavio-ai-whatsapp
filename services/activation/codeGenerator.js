// services/activation/codeGenerator.js

// Stockage temporaire des codes activés par numéro
const activeCodes = {}  

// Génère un code alphanumérique de 8 caractères pour un numéro
export function generateCodeForNumber(numero){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for(let i=0;i<8;i++){
    code += chars.charAt(Math.floor(Math.random()*chars.length))
  }

  // Stocke le code associé au numéro
  activeCodes[numero] = code
  return code
}

// Vérifie si le code correspond au numéro
export function verifyCode(numero, code){
  return activeCodes[numero] && activeCodes[numero] === code
}

export { activeCodes }
