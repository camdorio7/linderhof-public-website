/**
 * Read-only Square catalog integration. Products are never seeded from the old
 * Wix store. Only the dedicated Pro Shop category AND positive tracked stock
 * at the configured pickup location can appear on the public site.
 *
 * Checkout is handled by Square Online, where pickup-only fulfillment must be
 * configured and tested before SQUARE_ONLINE_STORE_URL is enabled.
 */
export type ShopVariation = { id: string; name: string; priceCents: number };
export type ShopProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  variations: ShopVariation[];
};

type SquareObject = {
  id: string;
  type: string;
  image_data?: { url?: string };
  item_data?: {
    name?: string;
    description?: string;
    image_ids?: string[];
    variations?: Array<{
      id: string;
      item_variation_data?: {
        name?: string;
        price_money?: { amount?: number; currency?: string };
        pricing_type?: string;
        track_inventory?: boolean;
      };
    }>;
  };
};

const API_VERSION = '2026-09-16';
const API_BASE = 'https://connect.squareup.com/v2';

function config() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN?.trim();
  const locationId = process.env.SQUARE_LOCATION_ID?.trim();
  const categoryId = process.env.SQUARE_PRO_SHOP_CATEGORY_ID?.trim();
  return accessToken && locationId && categoryId ? { accessToken, locationId, categoryId } : null;
}

async function squareRequest<T>(path: string, body: unknown, accessToken: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Square-Version': API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Square catalog request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export async function loadProShopProducts(): Promise<ShopProduct[]> {
  const settings = config();
  if (!settings) return [];
  const { accessToken, locationId, categoryId } = settings;
  const items: SquareObject[] = [];
  let cursor: string | undefined;
  do {
    const page: { items?: SquareObject[]; cursor?: string } = await squareRequest(
      '/catalog/search-catalog-items',
      {
        category_ids: [categoryId],
        enabled_location_ids: [locationId],
        archived_state: 'ARCHIVED_STATE_NOT_ARCHIVED',
        product_types: ['REGULAR'],
        limit: 100,
        ...(cursor ? { cursor } : {}),
      },
      accessToken,
    );
    items.push(...(page.items || []));
    cursor = page.cursor;
    if (items.length >= 500) break; // public catalog safety cap
  } while (cursor);

  const variationIds = items.flatMap(item => item.item_data?.variations?.map(v => v.id) || []);
  if (!variationIds.length) return [];

  const stock = new Map<string, number>();
  for (let i = 0; i < variationIds.length; i += 100) {
    const result: { counts?: Array<{ catalog_object_id: string; quantity: string; state?: string }> } =
      await squareRequest('/inventory/batch-retrieve-counts', {
        catalog_object_ids: variationIds.slice(i, i + 100),
        location_ids: [locationId],
        states: ['IN_STOCK'],
      }, accessToken);
    for (const row of result.counts || []) {
      if (row.state !== 'IN_STOCK') continue;
      stock.set(row.catalog_object_id, (stock.get(row.catalog_object_id) || 0) + Number(row.quantity || 0));
    }
  }

  const available = items.map(item => ({
    id: item.id,
    name: item.item_data?.name || 'Linderhof merchandise',
    description: item.item_data?.description || '',
    imageId: item.item_data?.image_ids?.[0],
    variations: (item.item_data?.variations || [])
      .filter(v => v.item_variation_data?.pricing_type === 'FIXED_PRICING'
        && v.item_variation_data.price_money?.currency === 'USD'
        && Number.isSafeInteger(v.item_variation_data.price_money?.amount)
        && (stock.get(v.id) || 0) > 0)
      .map(v => ({
        id: v.id,
        name: v.item_variation_data?.name || 'Standard',
        priceCents: v.item_variation_data!.price_money!.amount!,
      })),
  })).filter(item => item.variations.length > 0);

  const imageIds = [...new Set(available.map(p => p.imageId).filter((v): v is string => !!v))];
  const imageUrls = new Map<string, string>();
  for (let i = 0; i < imageIds.length; i += 100) {
    const result: { objects?: SquareObject[] } = await squareRequest('/catalog/batch-retrieve', {
      object_ids: imageIds.slice(i, i + 100),
    }, accessToken);
    for (const obj of result.objects || []) {
      const url = obj.image_data?.url;
      if (url && /^https:\/\//.test(url)) imageUrls.set(obj.id, url);
    }
  }

  return available.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageId ? imageUrls.get(item.imageId) || null : null,
    variations: item.variations,
  }));
}

export function getSquareStoreUrl(): string | null {
  const url = process.env.SQUARE_ONLINE_STORE_URL?.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !['square.site', 'squareup.com', 'square.online'].some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) return null;
    return parsed.toString();
  } catch { return null; }
}
