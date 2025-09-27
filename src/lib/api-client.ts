// lib/api-client.ts
import { useAuth } from '@clerk/nextjs';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async getProjects(params?: { status?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin
  async approveProject(id: string, data: { approved_credits?: number; review_notes?: string }) {
    return this.request(`/admin/projects/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectProject(id: string, data: { rejection_reason?: string }) {
    return this.request(`/admin/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // File Upload
  async uploadFile(file: File, bucket?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (bucket) formData.append('bucket', bucket);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// React hook for authenticated API client
export function useApiClient() {
  const { isSignedIn } = useAuth();

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!isSignedIn) {
      throw new Error('User not authenticated');
    }

    // Use standard session token without template
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  return {
    // Users
    async getUsers() {
      return makeAuthenticatedRequest('/api/users');
    },

    async createUser(userData: any) {
      return makeAuthenticatedRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    async updateUser(id: string, userData: any) {
      return makeAuthenticatedRequest(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
    },

    async deleteUser(id: string) {
      return makeAuthenticatedRequest(`/api/users/${id}`, {
        method: 'DELETE',
      });
    },

    // Projects
    async getProjects(params?: { status?: string; limit?: number; offset?: number }) {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());

      const query = searchParams.toString();
      return makeAuthenticatedRequest(`/api/projects${query ? `?${query}` : ''}`);
    },

    async getProject(id: string) {
      return makeAuthenticatedRequest(`/api/projects/${id}`);
    },

    async createProject(projectData: any) {
      return makeAuthenticatedRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },

    async updateProject(id: string, projectData: any) {
      return makeAuthenticatedRequest(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(projectData),
      });
    },

    async deleteProject(id: string) {
      return makeAuthenticatedRequest(`/api/projects/${id}`, {
        method: 'DELETE',
      });
    },

    // Admin
    async approveProject(id: string, data: { approved_credits?: number; review_notes?: string }) {
      return makeAuthenticatedRequest(`/api/admin/projects/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async rejectProject(id: string, data: { rejection_reason?: string }) {
      return makeAuthenticatedRequest(`/api/admin/projects/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // File Upload
    async uploadFile(file: File, bucket?: string) {
      if (!isSignedIn) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('file', file);
      if (bucket) formData.append('bucket', bucket);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
  };
}
