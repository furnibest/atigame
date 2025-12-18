import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("Product")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📦 POST /api/products - Request received");
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const featured =
      formData.get("featured") === "true" || formData.get("featured") === "1";

    // Validasi required fields
    if (!name || name.trim() === "") {
      console.error("❌ Validation error: name is required");
      return NextResponse.json(
        { error: "Nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!description || description.trim() === "") {
      console.error("❌ Validation error: description is required");
      return NextResponse.json(
        { error: "Deskripsi produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!category || category.trim() === "") {
      console.error("❌ Validation error: category is required");
      return NextResponse.json(
        { error: "Kategori produk wajib diisi" },
        { status: 400 }
      );
    }

    console.log("📝 Form data:", { name, description, category, featured });

    let image = null;
    const imageFile = formData.get("image") as File;

    if (imageFile && imageFile.size > 0) {
      console.log("🖼️ Image file detected:", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });
      try {
        // Validate file type
        if (!imageFile.type.startsWith("image/")) {
          console.error("❌ Invalid file type:", imageFile.type);
          return NextResponse.json(
            { error: "Only image files are allowed" },
            { status: 400 }
          );
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          console.error("❌ File too large:", imageFile.size);
          return NextResponse.json(
            { error: "File size must be less than 5MB" },
            { status: 400 }
          );
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Clean filename
        const filename = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        console.log("📤 Uploading image to Supabase...");
        // Upload to Supabase Storage
        image = await uploadImageToSupabase(buffer, filename, imageFile.type);
        console.log("✅ Image uploaded:", image);
      } catch (uploadError) {
        console.error("❌ Error uploading file:", uploadError);
        const errorMessage =
          uploadError instanceof Error ? uploadError.message : "Unknown error";

        // If upload fails, allow product to be saved without image
        console.warn("⚠️ Image upload failed, but continuing without image...");
        image = null;

        // Return warning but don't fail the request
        // The product will be saved without image
      }
    }

    const data: {
      name: string;
      description: string;
      image: string | null;
      category: string;
      featured: boolean;
      price: number;
    } = {
      name,
      description,
      image,
      category,
      featured,
      price: 0,
    };

    const priceValue = formData.get("price") as string | null;
    if (priceValue && !isNaN(parseFloat(priceValue))) {
      data.price = parseFloat(priceValue);
    }

    console.log("💾 Inserting product to database...");
    const supabase = getSupabaseClient();
    // Set timestamps manually to keep parity with Prisma defaults
    const now = new Date().toISOString();
    const insertPayload: {
      name: string;
      description: string;
      image: string | null;
      category: string;
      featured: boolean;
      price: number;
      createdAt: string;
      updatedAt: string;
    } = { ...data, createdAt: now, updatedAt: now };

    console.log("💾 Insert payload:", JSON.stringify(insertPayload, null, 2));

    const { data: inserted, error } = await supabase
      .from("Product")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        {
          error: `Failed to create product: ${error.message}`,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    if (!inserted) {
      console.error("❌ No data returned from insert");
      return NextResponse.json(
        { error: "Product created but no data returned" },
        { status: 500 }
      );
    }

    console.log("✅ Product created successfully:", inserted.id);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create product: ${errorMessage}` },
      { status: 500 }
    );
  }
}
