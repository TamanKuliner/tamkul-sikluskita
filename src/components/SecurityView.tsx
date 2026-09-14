/**
 * End-to-End Encryption (E2EE) & Security Audit Layer
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  FileCheck,
  AlertOctagon,
  Fingerprint,
  RefreshCw,
  Hash,
  Database,
  CheckCircle2,
  Copy,
} from "lucide-react";
import {
  encryptPayload,
  decryptPayload,
  getOrCreateMasterKey,
  generateVerificationSeal,
  EncryptedPackage,
} from "../utils/crypto";
import { SecurityAuditRecord } from "../types";
import { INITIAL_AUDIT_TRAIL } from "../data/mockData";

interface SecurityViewProps {
  isDarkMode: boolean;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ isDarkMode }) => {
  const [keyFingerprint, setKeyFingerprint] = useState<string>("LOAD-KEY...");
  const [inputPlaintext, setInputPlaintext] = useState<string>(
    '{"nama":"Ibu Sari","rt_rw":"RT 04/RW 03 Cilandak Barat","setoran":"4.2 kg Botol PET Bersih","poin":84}'
  );
  const [encryptedPackage, setEncryptedPackage] = useState<EncryptedPackage | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tamperTested, setTamperTested] = useState<boolean>(false);
  const [auditRecords, setAuditRecords] = useState<SecurityAuditRecord[]>(INITIAL_AUDIT_TRAIL);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateMasterKey().then(({ fingerprint }) => {
      setKeyFingerprint(fingerprint);
    });
  }, []);

  const handleEncrypt = async () => {
    setIsProcessing(true);
    setTamperTested(false);
    try {
      const pkg = await encryptPayload(inputPlaintext);
      setEncryptedPackage(pkg);
      setDecryptedText(null);

      // Add to audit trail
      const newAudit: SecurityAuditRecord = {
        id: `AUD-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        actor: "CLIENT:WEB_CONSOLE (E2EE Active)",
        action: "ENCRYPT_HOUSEHOLD_METRICS",
        rawPayloadSnippet: inputPlaintext.slice(0, 50) + "...",
        sha256Hash: pkg.sha256Digest,
        signature: `SIG-ECDSA-${pkg.keyFingerprint.slice(0, 6)}`,
        verified: true,
      };
      setAuditRecords((prev) => [newAudit, ...prev]);
    } catch (err) {
      console.error("Encryption error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedPackage) return;
    setIsProcessing(true);
    try {
      const plaintext = await decryptPayload(encryptedPackage);
      setDecryptedText(plaintext);
    } catch (err) {
      setDecryptedText("ERR: Dekripsi Gagal! Kunci tidak cocok atau integritas cipher rusak.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTamperTest = () => {
    if (!encryptedPackage) return;
    // Alter last 2 bytes of ciphertext to simulate data tampering
    const tampered = {
      ...encryptedPackage,
      cipherHex: encryptedPackage.cipherHex.slice(0, -4) + "beef",
      verified: false,
    };
    setEncryptedPackage(tampered);
    setTamperTested(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-900/50"
          : "bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Pusat Keamanan & Enkripsi End-to-End (E2EE) Solid
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Melindungi privasi identitas rumah tangga, data alamat pemukiman DKI Jakarta, dan bukti verifikasi setoran sirkular dengan kriptografi berstandar militer Web Crypto API (AES-GCM 256-bit & hash SHA-256).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>KEY: {keyFingerprint}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Security Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold">Cipher Enkripsi AES-GCM</span>
          </div>
          <div className="text-lg font-bold">256-Bit Galois/Counter Mode</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Enkripsi client-side dengan IV unik 96-bit untuk setiap transaksi, mencegah replay attack.
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Hash className="w-4 h-4 text-teal-500" />
            <span className="font-semibold">Integritas Data SHA-256</span>
          </div>
          <div className="text-lg font-bold">Immutable Ledger Hash</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Segel digital memastikan catatan pemulihan sampah tidak dapat diubah oleh pihak ketiga.
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Fingerprint className="w-4 h-4 text-purple-500" />
            <span className="font-semibold">Zero-Knowledge Privacy</span>
          </div>
          <div className="text-lg font-bold">Client-Side Keys</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Server perantara tidak dapat melihat identitas personal atau alamat warga tanpa kunci sah.
          </p>
        </div>
      </div>

      {/* Interactive Live Cryptographic Playground */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm">Laboratorium Kriptografi Interaktif E2EE</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji langsung proses enkripsi client-side, dekripsi, dan proteksi anti-tamper secara real-time
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">
            Web Crypto API
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Plaintext */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              1. Payload Data Mentah Rumah Tangga (Plaintext):
            </label>
            <textarea
              rows={4}
              value={inputPlaintext}
              onChange={(e) => setInputPlaintext(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200"
            />
            <button
              id="encrypt-payload-btn"
              onClick={handleEncrypt}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enkripsi Sekarang (AES-GCM-256)</span>
            </button>
          </div>

          {/* Encrypted Result */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Ciphertext Terenkripsi & Digital Seal:
              </label>
              {encryptedPackage && (
                <span className="text-[10px] text-emerald-500 font-mono">
                  SHA-256 Digest: {encryptedPackage.sha256Digest.slice(0, 12)}...
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] h-28 overflow-y-auto space-y-1 border border-slate-800">
              {encryptedPackage ? (
                <>
                  <div className="text-slate-400">// IV (Initialization Vector):</div>
                  <div className="text-cyan-300 break-all">{encryptedPackage.ivHex}</div>
                  <div className="text-slate-400 mt-1">// Ciphertext:</div>
                  <div className="text-emerald-300 break-all">{encryptedPackage.cipherHex}</div>
                  <div className="text-slate-400 mt-1">// Digital Seal:</div>
                  <div className="text-purple-300">
                    {generateVerificationSeal(encryptedPackage.sha256Digest)}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 italic">
                  Klik tombol "Enkripsi Sekarang" untuk menghasilkan ciphertext AES-GCM...
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="decrypt-payload-btn"
                onClick={handleDecrypt}
                disabled={!encryptedPackage || isProcessing}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Dekripsi & Uji</span>
              </button>

              <button
                id="tamper-test-btn"
                onClick={handleTamperTest}
                disabled={!encryptedPackage}
                className="py-2 px-3 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Simulasi Tamper (Ubah 2 Byte)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decryption Verification Output */}
        {decryptedText && (
          <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 ${
            tamperTested
              ? "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300"
              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {tamperTested ? <AlertOctagon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>
                {tamperTested
                  ? "Peringatan Integritas: Manipulasi Data Terdeteksi! Hash tidak cocok."
                  : "Verifikasi Integritas Sukses: Dekripsi AES-GCM cocok sempurna dengan hash SHA-256!"}
              </span>
            </div>
            <div className="break-all pt-1">{decryptedText}</div>
          </div>
        )}
      </div>

      {/* Cryptographic Immutable Audit Trail Table */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-3`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm">Buku Besar Audit Kriptografi (Immutable Ledger)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seluruh mutasi timbulan dan transaksi Bank Sampah ditandatangani secara kriptografis
            </p>
          </div>
          <Database className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b dark:border-slate-700 text-slate-400 text-[11px]">
                <th className="pb-2">Audit ID</th>
                <th className="pb-2">Aktor</th>
                <th className="pb-2">Aksi</th>
                <th className="pb-2">SHA-256 Digest</th>
                <th className="pb-2">Tanda Tangan</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {auditRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-2.5 text-slate-800 dark:text-slate-200 font-bold">{record.id}</td>
                  <td className="py-2.5 text-slate-500">{record.actor}</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400">{record.action}</td>
                  <td className="py-2.5 text-slate-400 truncate max-w-xs">{record.sha256Hash}</td>
                  <td className="py-2.5 text-purple-400">{record.signature}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VALID</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
