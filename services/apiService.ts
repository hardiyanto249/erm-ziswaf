import { RiskItem } from '../types';

// API Base URL - adjust if backend is running on different port
//const API_BASE_URL = 'http://localhost:8080/api/v1';
//const PUBLIC_API_BASE_URL = 'http://localhost:8080/api/public';

const API_BASE_URL = '/api/v1';
const PUBLIC_API_BASE_URL = '/api/public';

export interface ZisStats {
  period: string;
  data: {
    collection_total: number;
    distribution_total: number;
    beneficiaries: number;
    donors: number;
  };
  status: string;
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit): Promise<any> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Risk Management APIs
  async getRisks(): Promise<RiskItem[]> {
    const data = await this.fetchWithErrorHandling(`${API_BASE_URL}/risks`);
    return data;
  }

  async createRisk(risk: Omit<RiskItem, 'id' | 'created_at' | 'updated_at'>): Promise<RiskItem> {
    const data = await this.fetchWithErrorHandling(`${API_BASE_URL}/risks`, {
      method: 'POST',
      body: JSON.stringify(risk),
    });
    return data;
  }

  async updateRisk(id: string, risk: Partial<RiskItem>): Promise<RiskItem> {
    const data = await this.fetchWithErrorHandling(`${API_BASE_URL}/risks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(risk),
    });
    return data;
  }

  async deleteRisk(id: string): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/risks/${id}`, {
      method: 'DELETE',
    });
  }

  // Public APIs
  async getZisStats(): Promise<ZisStats> {
    const data = await this.fetchWithErrorHandling(`${PUBLIC_API_BASE_URL}/zis-stats`);
    return data;
  }
}

export const apiService = new ApiService();