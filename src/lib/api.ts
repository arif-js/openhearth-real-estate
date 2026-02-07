import { tableProperties, tableSavedHomes } from './airtable';
import { AirtableProperty } from '@/types/airtable';

export interface PropertyFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    status?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
}

interface GetPropertiesResponse {
    properties: AirtableProperty[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export async function getProperties(filters: PropertyFilters = {}, all = false): Promise<GetPropertiesResponse> {
    try {

        if (all) {
            const records = await tableProperties
                .select({
                    maxRecords: 100,
                    view: 'Grid view',
                })
                .all();

            return {
                properties: records.map((record) => ({
                    Record_ID: record.id,
                    ...record.fields,
                })) as AirtableProperty[],
                total: records.length,
                totalPages: 1,
                currentPage: 1
            };
        }

        const { search, minPrice, maxPrice, bedrooms, status, page = 1, pageSize = 12 } = filters;
        const formulaParts = [];

        if (search) {
            formulaParts.push(`OR(
                FIND(LOWER("${search}"), LOWER({Title})),
                FIND(LOWER("${search}"), LOWER({Description})),
                FIND(LOWER("${search}"), LOWER({Location} & "")),
                FIND(LOWER("${search}"), LOWER({State} & ""))
            )`);
        }

        if (minPrice) {
            formulaParts.push(`{Price} >= ${minPrice}`);
        }

        if (maxPrice) {
            formulaParts.push(`{Price} <= ${maxPrice}`);
        }

        if (bedrooms) {
            formulaParts.push(`{Bedrooms} >= ${bedrooms}`);
        }

        if (status) {
            formulaParts.push(`{Status} = "${status}"`);
        }

        const filterFormula = formulaParts.length > 0 ? `AND(${formulaParts.join(', ')})` : '';

        // Handle Sorting
        let sort: { field: string; direction: 'asc' | 'desc' }[] = [{ field: 'Title', direction: 'asc' }]; // Default

        if (filters.sortBy === 'newest') {
            sort = [{ field: 'Title', direction: 'asc' }];
        } else if (filters.sortBy === 'price-asc') {
            sort = [{ field: 'Price', direction: 'asc' }];
        } else if (filters.sortBy === 'price-desc') {
            sort = [{ field: 'Price', direction: 'desc' }];
        }

        const records = await tableProperties
            .select({
                maxRecords: 100,
                view: 'Grid view',
                filterByFormula: filterFormula,
                sort: sort,
            })
            .all();

        const allProperties = records.map((record) => ({
            Record_ID: record.id,
            ...record.fields,
        })) as AirtableProperty[];

        const total = allProperties.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const properties = allProperties.slice(start, start + pageSize);

        return {
            properties,
            total,
            totalPages,
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching properties from Airtable:', error);
        return { properties: [], total: 0, totalPages: 0, currentPage: 1 };
    }
}

export async function getFeaturedProperties() {
    try {
        const records = await tableProperties
            .select({
                filterByFormula: '{Is Featured} = 1',
                maxRecords: 6,
            })
            .all();

        return records.map((record) => ({
            Record_ID: record.id,
            ...record.fields,
        })) as AirtableProperty[];
    } catch (error) {
        console.error('Error fetching featured properties:', error);
        return [];
    }
}

export async function getPropertyById(id: string) {
    try {
        const record = await tableProperties.find(id);

        if (!record) return null;

        return {
            Record_ID: record.id,
            ...record.fields,
        } as AirtableProperty;
    } catch (error) {
        console.error('Error fetching property by id:', error);
        return null;
    }
}

export async function getSavedProperties(clerkUserId: string) {
    try {
        const savedRecords = await tableSavedHomes
            .select({
                filterByFormula: `{Clerk User ID} = "${clerkUserId}"`,
            })
            .all();

        if (savedRecords.length === 0) return [];

        // Get all property IDs from saved records
        const propertyIds = savedRecords.map((r) => (r.fields.Property as string[])[0]);

        // Fetch details for each property
        const propertyPromises = propertyIds.map((id) => getPropertyById(id));
        const properties = await Promise.all(propertyPromises);

        return properties.filter((p) => p !== null) as AirtableProperty[];
    } catch (error) {
        console.error('Error fetching saved properties:', error);
        return [];
    }
}
