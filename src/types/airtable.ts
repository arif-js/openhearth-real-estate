export interface AirtableProperty {
  Record_ID: string;
  Title: string;
  Slug: string;
  Status: 'Active' | 'Pending' | 'Sold';
  Price: number;
  Images?: {
    url: string;
    thumbnails?: {
      small: { url: string };
      large: { url: string };
      full: { url: string };
    };
  }[];
  Bedrooms: number;
  Description: string;
  Agent: string[]; // Linked records
  "Is Featured"?: boolean;
  "SEO Slug"?: string;
  "Agent Name (Lookup)"?: string[];
  "Agent Email (Lookup)"?: string[];
  "Lead Count"?: number;
  "Saved Count"?: number;
  "Saved Homes"?: string[];
  "Clerk_User_IDs_FROM_SAVED_HOMES"?: string[];
  "Short Description (AI)"?: string;
  "Property Highlights (AI)"?: string;
  "Amenities"?: string;
  Location?: string;
  State?: string;
  Longitude?: number;
  Latitude?: number;
}

export interface AirtableAgent {
  Name: string;
  Email: string;
  Photo?: { url: string }[];
  Bio: string;
  "Properties Listed"?: string[];
  "Properties"?: string[];
  "Active Properties"?: number;
  "Leads Assigned"?: string[];
}

export interface AirtableLead {
  Status: 'New' | 'Contacted' | 'Closed';
  "Lead Name": string;
  "Lead Email": string;
  Message: string;
  Property: string[]; // Linked records
  "Clerk User ID"?: string;
}

export interface AirtableSavedHome {
  Link_ID: string;
  "Clerk User ID": string;
  Property: string[]; // Linked records
  "Saved At": string;
  "Days Since Saved"?: number;
  "Is Recently Saved"?: boolean;
  "Personalized Recommendation (AI)"?: string;
}
