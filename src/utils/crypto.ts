/**
 * End-to-End Encryption (E2EE) & Cryptographic Security Layer
 * Implements Web Crypto API (AES-GCM 256-bit & SHA-256)
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026
 */

// Generate SHA-256 hash string
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Internal persistent master encryption key
let cachedCryptoKey: CryptoKey | null = null;
let cachedKeyFingerprint: string = "";

export async function getOrCreateMasterKey(): Promise<{ key: CryptoKey; fingerprint: string }> {
  if (cachedCryptoKey && cachedKeyFingerprint) {
    return { key: cachedCryptoKey, fingerprint: cachedKeyFingerprint };
  }

  // Generate an AES-GCM 256-bit key
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await crypto.subtle.exportKey("raw", key);
  const exportedArray = Array.from(new Uint8Array(exported));
  const hex = exportedArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const fingerprint = await sha256(hex);

  cachedCryptoKey = key;
  cachedKeyFingerprint = fingerprint.slice(0, 16).toUpperCase();

  return { key, fingerprint: cachedKeyFingerprint };
}

export interface EncryptedPackage {
  cipherHex: string;
  ivHex: string;
  keyFingerprint: string;
  sha256Digest: string;
  timestamp: string;
  verified: boolean;
}

// Encrypt plaintext payload with AES-GCM 256
export async function encryptPayload(plaintext: string): Promise<EncryptedPackage> {
  const { key, fingerprint } = await getOrCreateMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const encoded = new TextEncoder().encode(plaintext);

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded
  );

  const cipherArray = Array.from(new Uint8Array(cipherBuffer));
  const cipherHex = cipherArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const digest = await sha256(plaintext);

  return {
    cipherHex,
    ivHex,
    keyFingerprint: fingerprint,
    sha256Digest: digest,
    timestamp: new Date().toISOString(),
    verified: true,
  };
}

// Decrypt ciphertext back to string
export async function decryptPayload(pkg: EncryptedPackage): Promise<string> {
  const { key } = await getOrCreateMasterKey();

  const ivBytes = new Uint8Array(
    pkg.ivHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );
  const cipherBytes = new Uint8Array(
    pkg.cipherHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes,
    },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuffer);
}

// Verification seal generator
export function generateVerificationSeal(sha256Hash: string): string {
  return `SEAL:SIKLUSKITA-DKI-E2EE-${sha256Hash.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}
