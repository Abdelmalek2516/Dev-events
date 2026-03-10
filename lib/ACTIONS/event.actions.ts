'use server';

import Event from "@/database/event.model";
import connectDB from "../mongodb";
import { Tag } from "lucide-react";

export const getSimilairEventsBySlug = async (slug: string) => {
  try{ 
    await connectDB();
    const event = await Event.findOne({ slug }).lean();

    if (!event) return [];

    // Query the model (Event), not the document instance (event)
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch(e){
    return [];
  }
}
 