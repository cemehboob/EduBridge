import {
  UserAccount,
  UserActivityRecord,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  IncompleteAttemptRecord,
  AttemptDetailResponse,
  SmtpConfigView,
  EmailLogEntryView
} from '../types';

const TOKEN_KEY = 'edubridge_auth_token_v1';
const SERVER_URL_KEY = 'edubridge_central_server_url';

export const getCentralServerUrl = (): string => {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(SERVER_URL_KEY);
      if (stored && stored.trim()) {
        return stored.trim().replace(/\/+$/, '');
      }
    } catch {}
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'http://127.0.0.1:3000';
};

export const setCentralServerUrl = (url: string | null): void => {
  try {
    if (url && url.trim()) {
      localStorage.setItem(SERVER_URL_KEY, url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem(SERVER_URL_KEY);
    }
  } catch {}
};

// Base API URL: uses central server URL + /api
const getBaseUrl = (): string => {
  return `${getCentralServerUrl()}/api`;
};

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof sessionStorage !== 'undefined') {
      try {
        this.token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      } catch {
        this.token = null;
      }
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    try {
      if (token) {
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(TOKEN_KEY, token);
        if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
      } else {
        if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(TOKEN_KEY);
        if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // Storage unavailable in strict sandbox
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof localStorage !== 'undefined') {
      try {
        this.token = sessionStorage?.getItem(TOKEN_KEY) || localStorage?.getItem(TOKEN_KEY);
      } catch {
        this.token = null;
      }
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    // Include trusted active user identification header
    try {
      if (typeof localStorage !== 'undefined') {
        const activeUserId = localStorage.getItem('edubridge_active_user_id');
        if (activeUserId) {
          headers['x-user-id'] = activeUserId;
        }
      }
    } catch {}

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(data.error || `Request failed with status ${response.status}`);
      (err as any).statusCode = response.status;
      throw err;
    }

    return data as T;
  }

  // --- Health & Connection Diagnostics ---
  public health = {
    check: async (customUrl?: string): Promise<{ healthy: boolean; stats: any; latencyMs: number; error?: string }> => {
      const startTime = Date.now();
      const targetBase = customUrl ? customUrl.trim().replace(/\/+$/, '') : getCentralServerUrl();
      try {
        const response = await fetch(`${targetBase}/api/health`, {
          method: 'GET',
          headers: { Accept: 'application/json' }
        });
        const latencyMs = Date.now() - startTime;
        if (!response.ok) {
          return { healthy: false, stats: null, latencyMs, error: `HTTP ${response.status}` };
        }
        const data = await response.json();
        return { healthy: true, stats: data, latencyMs };
      } catch (err: any) {
        return { healthy: false, stats: null, latencyMs: Date.now() - startTime, error: err.message };
      }
    }
  };

  // --- Auth APIs ---
  public auth = {
    ensureSession: async (user: UserAccount): Promise<string | null> => {
      try {
        const res = await this.request<{ success: boolean; token: string }>('/auth/session-sync', {
          method: 'POST',
          body: JSON.stringify({ userId: user.id, email: user.email })
        });
        if (res && res.token) {
          this.setToken(res.token);
          return res.token;
        }
      } catch (err: any) {
        console.warn('[ApiService] Background session sync notice:', err.message);
      }
      return this.getToken();
    },

    register: async (userData: Partial<UserAccount>): Promise<{ user: UserAccount; token: string }> => {
      const res = await this.request<{ success: boolean; user: UserAccount; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    },

    login: async (identifier: string, password: string): Promise<{ user: UserAccount; token: string }> => {
      const res = await this.request<{ success: boolean; user: UserAccount; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    },

    getMe: async (): Promise<UserAccount> => {
      const res = await this.request<{ success: boolean; user: UserAccount }>('/auth/me');
      return res.user;
    },

    logout: async (): Promise<void> => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch {
        // Ignore network error on logout
      } finally {
        this.setToken(null);
      }
    },

    requestRegistrationOtp: async (userData: Partial<UserAccount>): Promise<{
      success: boolean;
      message: string;
      email: string;
      expiresInSeconds: number;
      deliveryStatus: string;
      devOtp?: string;
    }> => {
      return this.request('/auth/register/request-otp', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    verifyRegistrationOtp: async (
      email: string,
      otp: string
    ): Promise<{ success: boolean; message: string; user: UserAccount; token: string }> => {
      const res = await this.request<{ success: boolean; message: string; user: UserAccount; token: string }>(
        '/auth/register/verify-otp',
        {
          method: 'POST',
          body: JSON.stringify({ email, otp })
        }
      );
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    },

    requestPasswordResetOtp: async (email: string): Promise<{
      success: boolean;
      message: string;
      expiresInSeconds: number;
      deliveryStatus: string;
      devOtp?: string;
    }> => {
      return this.request('/auth/password-reset/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    verifyPasswordResetOtp: async (
      email: string,
      otp: string,
      newPassword: string
    ): Promise<{ success: boolean; message: string }> => {
      return this.request('/auth/password-reset/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword })
      });
    }
  };

  // --- User APIs ---
  public users = {
    getAll: async (): Promise<UserAccount[]> => {
      const res = await this.request<{ success: boolean; items: UserAccount[] }>('/users');
      return res.items;
    },

    getById: async (id: string): Promise<UserAccount> => {
      const res = await this.request<{ success: boolean; user: UserAccount }>(`/users/${id}`);
      return res.user;
    },

    update: async (id: string, updates: Partial<UserAccount>): Promise<UserAccount> => {
      const res = await this.request<{ success: boolean; user: UserAccount }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return res.user;
    },

    getFullHistory: async (userId: string) => {
      const res = await this.request<{ success: boolean; data: any }>(`/admin/users/${userId}/full-history`);
      return res.data;
    },

    initiatePasswordReset: async (userId: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/admin/users/${userId}/initiate-reset`, {
        method: 'POST'
      });
    },

    verifyEmail: async (userId: string): Promise<{ success: boolean; user: UserAccount; message: string }> => {
      return this.request<{ success: boolean; user: UserAccount; message: string }>(`/admin/users/${userId}/verify-email`, {
        method: 'POST'
      });
    }
  };

  // --- Activity APIs ---
  public activities = {
    getAll: async (filter?: {
      userId?: string;
      examType?: string;
      module?: string;
      category?: string;
      status?: string;
      search?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ items: UserActivityRecord[]; total: number }> => {
      const params = new URLSearchParams();
      if (filter?.userId) params.set('userId', filter.userId);
      if (filter?.examType) params.set('examType', filter.examType);
      if (filter?.module) params.set('module', filter.module);
      if (filter?.category) params.set('category', filter.category);
      if (filter?.status) params.set('status', filter.status);
      if (filter?.search) params.set('search', filter.search);
      if (filter?.limit) params.set('limit', String(filter.limit));
      if (filter?.offset) params.set('offset', String(filter.offset));

      const query = params.toString() ? `?${params.toString()}` : '';
      return this.request<{ success: boolean; items: UserActivityRecord[]; total: number }>(`/activities${query}`);
    },

    getById: async (id: string): Promise<UserActivityRecord> => {
      const res = await this.request<{ success: boolean; activity: UserActivityRecord }>(`/activities/${id}`);
      return res.activity;
    },

    save: async (activity: UserActivityRecord): Promise<UserActivityRecord> => {
      const res = await this.request<{ success: boolean; activity: UserActivityRecord }>('/activities', {
        method: 'POST',
        body: JSON.stringify(activity)
      });
      return res.activity;
    },

    saveBatch: async (activities: UserActivityRecord[]): Promise<UserActivityRecord[]> => {
      const res = await this.request<{ success: boolean; activities: UserActivityRecord[] }>('/activities/batch', {
        method: 'POST',
        body: JSON.stringify({ activities })
      });
      return res.activities || [];
    },

    getAttemptDetail: async (activityId: string): Promise<AttemptDetailResponse> => {
      const res = await this.request<{ success: boolean; data: AttemptDetailResponse }>(
        `/activities/${activityId}/show-attempt`
      );
      return res.data;
    }
  };

  // --- Attempts APIs ---
  public attempts = {
    getQuestions: async (filter?: { userId?: string; testId?: string; activityId?: string }): Promise<QuestionAttemptRecord[]> => {
      const params = new URLSearchParams();
      if (filter?.userId) params.set('userId', filter.userId);
      if (filter?.testId) params.set('testId', filter.testId);
      if (filter?.activityId) params.set('activityId', filter.activityId);

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await this.request<{ success: boolean; items: QuestionAttemptRecord[] }>(`/attempts/questions${query}`);
      return res.items;
    },

    saveQuestions: async (
      payload: QuestionAttemptRecord | QuestionAttemptRecord[]
    ): Promise<QuestionAttemptRecord[]> => {
      const res = await this.request<{ success: boolean; items?: QuestionAttemptRecord[]; item?: QuestionAttemptRecord }>(
        '/attempts/questions',
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );
      return res.items || (res.item ? [res.item] : []);
    },

    getWritten: async (filter?: { userId?: string; activityId?: string }): Promise<WrittenResponseRecord[]> => {
      const params = new URLSearchParams();
      if (filter?.userId) params.set('userId', filter.userId);
      if (filter?.activityId) params.set('activityId', filter.activityId);

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await this.request<{ success: boolean; items: WrittenResponseRecord[] }>(`/attempts/written${query}`);
      return res.items;
    },

    saveWritten: async (written: WrittenResponseRecord): Promise<WrittenResponseRecord> => {
      const res = await this.request<{ success: boolean; item: WrittenResponseRecord }>('/attempts/written', {
        method: 'POST',
        body: JSON.stringify(written)
      });
      return res.item;
    },

    getAutosave: async (userId: string, testId?: string): Promise<IncompleteAttemptRecord | null> => {
      const query = testId ? `?testId=${encodeURIComponent(testId)}` : '';
      const res = await this.request<{ success: boolean; attempt: IncompleteAttemptRecord | null }>(
        `/attempts/autosave/${userId}${query}`
      );
      return res.attempt;
    },

    saveAutosave: async (attempt: IncompleteAttemptRecord): Promise<IncompleteAttemptRecord> => {
      const res = await this.request<{ success: boolean; attempt: IncompleteAttemptRecord }>('/attempts/autosave', {
        method: 'POST',
        body: JSON.stringify(attempt)
      });
      return res.attempt;
    },

    clearAutosave: async (userId: string, testId: string): Promise<boolean> => {
      const res = await this.request<{ success: boolean }>(`/attempts/autosave/${userId}/${encodeURIComponent(testId)}`, {
        method: 'DELETE'
      });
      return res.success;
    }
  };

  // --- SMTP Management & Diagnostics APIs ---
  public smtp = {
    getConfig: async (): Promise<SmtpConfigView> => {
      const res = await this.request<{ success: boolean; config: SmtpConfigView }>('/admin/smtp');
      return res.config;
    },

    saveConfig: async (config: Partial<SmtpConfigView>): Promise<{ success: boolean; message: string; config: SmtpConfigView }> => {
      return this.request('/admin/smtp', {
        method: 'POST',
        body: JSON.stringify(config)
      });
    },

    testConnection: async (payload?: {
      recipientEmail?: string;
      host?: string;
      port?: number;
      encryption?: 'NONE' | 'SSL' | 'STARTTLS' | 'SSL/TLS' | 'None' | string;
      authUser?: string;
      authPass?: string;
      fromEmail?: string;
      fromName?: string;
    }): Promise<{ success: boolean; message: string; logs?: EmailLogEntryView[] }> => {
      return this.request('/admin/smtp/test', {
        method: 'POST',
        body: JSON.stringify(payload || {})
      });
    },

    getLogs: async (): Promise<EmailLogEntryView[]> => {
      const res = await this.request<{ success: boolean; logs: EmailLogEntryView[] }>('/admin/smtp/logs');
      return res.logs;
    }
  };
}

export const apiService = new ApiService();

