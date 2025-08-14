import api from './axiosInstance';
import { Launch, Launchpad } from '../types/spacex';

export async function fetchLaunches(page = 1, limit = 10): Promise<Launch[]> {
  const { data } = await api.post('/v5/launches/query', {
    query: {},
    options: {
      sort: { date_utc: 'desc' },
      limit,
      page,
      populate: ['links.patch'],
    },
  });

  return data.docs;
}

export async function fetchLaunch(id: string): Promise<Launch> {
  const { data } = await api.get(`/v5/launches/${id}`);
  return data;
}

export async function fetchLaunchpad(id: string): Promise<Launchpad> {
  const { data } = await api.get(`/v4/launchpads/${id}`);

  return data;
}
