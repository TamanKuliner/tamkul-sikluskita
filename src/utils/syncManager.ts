/**
 * Real-time Cross-Device Synchronization & Offline Outbox Manager
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026
 */

import { WasteLogEntry, ConnectedDevice } from "../types";
import { sha256 } from "./crypto";

const CHANNEL_NAME = "sikluskita_cross_device_sync_channel";
const OUTBOX_KEY = "sikluskita_offline_outbox_queue";
const LOGS_STORAGE_KEY = "sikluskita_waste_logs_history";
const DEVICE_ID_KEY = "sikluskita_device_instance_id";

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = "dev-" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export class SyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: ((event: { type: string; payload: any }) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        this.notifyListeners(event.data);
      };
    }
  }

  public subscribe(callback: (event: { type: string; payload: any }) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(data: { type: string; payload: any }) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error("Sync listener error:", err);
      }
    });
  }

  public broadcast(type: string, payload: any) {
    const message = { type, payload, timestamp: Date.now(), origin: getOrCreateDeviceId() };
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn("BroadcastChannel error:", err);
      }
    }
    // Also notify local listeners
    this.notifyListeners(message);
  }

  // Offline queue operations
  public getOfflineQueue(): WasteLogEntry[] {
    try {
      const raw = localStorage.getItem(OUTBOX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public addToOfflineQueue(entry: WasteLogEntry) {
    const queue = this.getOfflineQueue();
    queue.push(entry);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(queue));
    this.broadcast("QUEUE_UPDATED", { queueLength: queue.length });
  }

  public clearOfflineQueue() {
    localStorage.removeItem(OUTBOX_KEY);
    this.broadcast("QUEUE_CLEARED", { queueLength: 0 });
  }

  // Push synchronization to server
  public async syncWithServer(isOfflineSimulated: boolean = false): Promise<{
    success: boolean;
    syncedCount: number;
    activeDevices: ConnectedDevice[];
  }> {
    if (isOfflineSimulated || (typeof navigator !== "undefined" && !navigator.onLine)) {
      return {
        success: false,
        syncedCount: 0,
        activeDevices: this.getLocalDevices(),
      };
    }

    const queue = this.getOfflineQueue();
    const deviceId = getOrCreateDeviceId();
    const payloadSnippet = JSON.stringify(queue);
    const encryptedPayloadHash = await sha256(payloadSnippet);

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          deviceName: navigator.userAgent.includes("Mac")
            ? "MacBook Air (Web Control Hub)"
            : navigator.userAgent.includes("iPhone")
            ? "iPhone (Mobile App)"
            : "Terminal Workstation DKI",
          clientLogs: queue,
          encryptedPayloadHash,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        this.clearOfflineQueue();
        this.broadcast("SYNC_COMPLETED", {
          syncedAt: data.syncedAt,
          count: queue.length,
        });

        return {
          success: true,
          syncedCount: queue.length,
          activeDevices: data.activeDevices || this.getLocalDevices(),
        };
      }
    } catch (err) {
      console.warn("Server sync unreachable:", err);
    }

    return {
      success: false,
      syncedCount: 0,
      activeDevices: this.getLocalDevices(),
    };
  }

  public getLocalDevices(): ConnectedDevice[] {
    return [
      {
        id: getOrCreateDeviceId(),
        deviceName: "Perangkat Saat Ini (Active Console)",
        ip: "180.248.14.88 (DKI Jakarta)",
        status: "ONLINE",
        lastSeen: "Baru saja",
        os: typeof navigator !== "undefined" ? navigator.platform : "Web OS",
        isCurrentDevice: true,
      },
      {
        id: "dev-mob-721",
        deviceName: "iPhone 15 Pro (Ibu Sari - Rumah Tangga)",
        ip: "182.253.99.12 (Cilandak Barat)",
        status: "ONLINE",
        lastSeen: "30 detik lalu",
        os: "iOS 18.2",
      },
      {
        id: "dev-tab-882",
        deviceName: "Samsung Galaxy Tab Active (Operator TPS3R)",
        ip: "114.124.45.10 (Pondok Labu)",
        status: "SYNCED",
        lastSeen: "3m yang lalu",
        os: "Android 14 Enterprise",
      },
    ];
  }
}

export const syncManager = new SyncManager();
