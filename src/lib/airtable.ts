import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY) {
    console.warn('AIRTABLE_API_KEY is missing');
}

if (!process.env.AIRTABLE_BASE_ID) {
    console.warn('AIRTABLE_BASE_ID is missing');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY || 'dummy' }).base(
    process.env.AIRTABLE_BASE_ID || 'dummy'
);

// Table Names as per Airtable Schema
export const TABLES = {
    PROPERTIES: 'Properties',
    AGENTS: 'Agents',
    LEADS: 'Leads',
    SAVED_HOMES: 'Saved Homes',
};

export const tableProperties = base(TABLES.PROPERTIES);
export const tableAgents = base(TABLES.AGENTS);
export const tableLeads = base(TABLES.LEADS);
export const tableSavedHomes = base(TABLES.SAVED_HOMES);

export default base;
