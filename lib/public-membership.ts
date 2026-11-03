import defaults from '../content/membership-defaults.json';
type Announcement = { enabled: boolean; title: string; details: string; flyer: string; checkout: string };
type Membership = typeof defaults & { announcement?: Announcement | null };
export async function readMembership(): Promise<Membership> {
  try {
    const res = await fetch('https://linderhofmembers.com/api/public-membership', {cache:'no-store',signal:AbortSignal.timeout(5000)});
    if (!res.ok) return defaults;
    const data = await res.json();
    if (!Array.isArray(data?.plans) || !data.plans.every((p: Record<string,unknown>)=>p && ['name','price','access','details'].every(k=>typeof p[k]==='string')) ||
      !['title','intro','note','checkout'].every(k=>typeof data[k]==='string')) return defaults;
    return data;
  } catch { return defaults; }
}
