"use server";

import { tableLeads, tableSavedHomes } from "./airtable";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
    const leadName = formData.get("leadName") as string;
    const leadEmail = formData.get("leadEmail") as string;
    const leadPhone = formData.get("leadPhone") as string;
    const message = formData.get("message") as string;
    const propertyId = formData.get("propertyId") as string;
    const clerkUserId = formData.get("clerkUserId") as string || "";

    try {
        await tableLeads.create([
            {
                fields: {
                    Status: "New",
                    "Lead Name": leadName,
                    "Lead Email": leadEmail,
                    Message: `Phone: ${leadPhone}\n\n${message}`,
                    Property: [propertyId],
                    "Clerk User ID": clerkUserId,
                },
            },
        ]);
        return { success: true };
    } catch (error) {
        console.error("Error submitting lead:", error);
        return { success: false, error: "Failed to submit lead" };
    }
}

export async function toggleSaveProperty(propertyTitle: string, propertyId: string, clerkUserId: string, saved: boolean) {
    try {
        if (saved) {
            const savedHomes = await tableSavedHomes
                .select({
                    filterByFormula: `AND({Clerk User ID} = "${clerkUserId}", FIND("${propertyTitle}", {Property}) > 0)`
                })
                .firstPage();

            if (savedHomes.length > 0) {
                await tableSavedHomes.destroy(savedHomes.map(r => r.id));
                console.log('Deleted successfully');
            }
            revalidatePath("/dashboard");
            return { saved: false };
        } else {
            // Create new
            await tableSavedHomes.create([
                {
                    fields: {
                        "Clerk User ID": clerkUserId,
                        Property: [propertyId],
                    },
                },
            ]);
            revalidatePath("/dashboard");
            revalidatePath(`/properties/${propertyId}`);
            return { saved: true };
        }
    } catch (error) {
        console.error("Error toggling save property:", error);
        return { error: "Failed to save property" };
    }
}

