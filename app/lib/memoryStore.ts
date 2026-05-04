// In-memory storage for fallback when MongoDB is not available
interface UserRecord {
  _id: string;
  email: string;
  robloxUsername?: string;
  purchasedItems: string[];
  aiUsageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OtpRecord {
  _id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

class MemoryStore {
  private users: Map<string, UserRecord>;
  private otps: Map<string, OtpRecord>;

  constructor() {
    this.users = new Map();
    this.otps = new Map();
  }

  // User methods
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const userArray = Array.from(this.users.values());
    for (const user of userArray) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findUserById(_id: string): Promise<UserRecord | null> {
    return this.users.get(_id) || null;
  }

  async createUser(data: Omit<UserRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const _id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const user: UserRecord = { ...data, _id, createdAt: now, updatedAt: now };
    this.users.set(_id, user);
    return user;
  }

  async updateUser(_id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const user = this.users.get(_id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(_id, updated);
    return updated;
  }

  async getAllUsers(): Promise<UserRecord[]> {
    return Array.from(this.users.values());
  }

  // OTP methods
  async createOtp(email: string, otp: string): Promise<OtpRecord> {
    const _id = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const otpRecord: OtpRecord = {
      _id,
      email,
      otp,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000), // 10 minutes
      createdAt: now,
    };
    this.otps.set(_id, otpRecord);
    return otpRecord;
  }

  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    const otpArray = Array.from(this.otps.values());
    for (const otp of otpArray) {
      if (otp.email === email) return otp;
    }
    return null;
  }

  async deleteExpiredOtps(): Promise<void> {
    const now = new Date();
    const otpEntries = Array.from(this.otps.entries());
    for (const [key, otp] of otpEntries) {
      if (otp.expiresAt < now) {
        this.otps.delete(key);
      }
    }
  }
}

export const memoryStore = new MemoryStore();
