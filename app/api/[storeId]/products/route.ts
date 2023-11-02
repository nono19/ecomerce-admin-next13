import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: {params: {storeId : string}}
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { 
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeature,
      isArchived
     } = body;
    
    if(!userId){
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!name){
      return new NextResponse("Name is required", { status: 400 });
    }

    if(!price){
      return new NextResponse("Price is required", { status: 400 });
    }

    if(!categoryId){
      return new NextResponse("Category is required", { status: 400 });
    }

    if(!sizeId){
      return new NextResponse("Size is required", { status: 400 });
    }

    if(!colorId){
      return new NextResponse("Color is required", { status: 400 });
    }

    if(!images || !images.length){
      return new NextResponse("Image Url is required", { status: 400 });
    }

    if(!params.storeId){
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserid = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!storeByUserid){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const products = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeature,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCT_POST]', error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: {params: {storeId : string}}
) {
  try {

    const { searchParams }  = new URL(req.url);
    const categoryId        = searchParams.get("categoryId") || undefined;
    const colorId           = searchParams.get("colorId") || undefined;
    const sizeId            = searchParams.get("sizeId") || undefined;
    const isFeature         = searchParams.get("isFeature");

    if(!params.storeId){
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeature: isFeature ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("internal server error", { status: 500 });
  }
}