import {
  UserAccount,
  UserActivityRecord,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  IncompleteAttemptRecord,
  AttemptDetailResponse
} from '../types';

const TOKEN_KEY = 'edubridge_auth_token_v1';

// Base API URL: In browser, uses current origin + /api. In Node or SSR, defaults to http://127.0.0.1:3000/api
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/api`;
  }
  return 'http://127.0.0.1:3000/api';
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

  // --- Auth APIs ---
  public auth = {
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

  // --- Health API ---
  public health = {
    check: async () => {
      return this.request<{ success: boolean; status: string; totalUsers: number; totalActivities: number }>('/health');
    }
  };
}

export const apiService = new ApiService();

