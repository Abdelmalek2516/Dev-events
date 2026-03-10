import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model"

export async function POST(request: NextRequest) {
  try{
    await connectDB();

    const formData = await request.formData();
    const event = Object.fromEntries(formData.entries());
    const file = formData.get("image") as File ;

     if (!file)return NextResponse.json({message: "Image file is required"}, {status: 400});

     // Support both JSON array strings (e.g. '["a","b"]') and multiple form values
     const parseArrayField = (key: string): string[] => {
       const multiple = formData.getAll(key) as string[];
       if (multiple.length > 1) return multiple;
       const single = multiple[0];
       if (!single) return [];
       try {
         const parsed = JSON.parse(single);
         return Array.isArray(parsed) ? parsed : [single];
       } catch {
         // Fallback: treat as comma-separated string
         return single.split(',').map((s) => s.trim()).filter(Boolean);
       }
     };

     const tags = parseArrayField('tags');
     const agenda = parseArrayField('agenda');

     const arrayBuffer = await file.arrayBuffer();

     const  buffer = Buffer.from(arrayBuffer);

     const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {return reject(error);}
        resolve(result);
      }).end(buffer);
    });

    event.image = (uploadResult as {secure_url: string}).secure_url;


    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });
    return NextResponse.json({message: "Event created successfully", event: createdEvent}, {status: 201});

  }catch(e){
    console.log(e);
    return NextResponse.json({message: "Error creating event", error: e instanceof Error ? e.message : "Unknown error"}, {status: 500});
  }
}

export async function GET() {
  try{
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({message : 'events fetched successfully',events}, {status: 200});
  } catch(e){
    return NextResponse.json({message: "Error fetching events", error: e instanceof Error ? e.message : "Unknown error"}, {status: 500});
  }
}