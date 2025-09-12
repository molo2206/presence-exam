import { randomBytes } from 'crypto';

export function generateMatricule(): string {
  // Générer 1 octet → 2 caractères hex
  const random = randomBytes(1).toString('hex').toUpperCase(); // ex: "A1"

  // Prendre les 2 derniers chiffres du timestamp pour l'unicité relative
  const timestamp = Date.now().toString().slice(-2); // ex: "89"

  return `STU-${timestamp}-${random}`; // ex: "STU-89-A1"
}

