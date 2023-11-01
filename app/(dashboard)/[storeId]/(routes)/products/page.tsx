import prismadb from "@/lib/prismadb"
import { format } from "date-fns";
import { ProductClient } from "./components/client"
import { ProductColoum } from "./components/coloumns";
import { formatter } from "@/lib/utils";

const ProductPage = async ({
  params
}: {
  params: {storeId: string}
}) => {
  const product = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColoum[] = product.map((item) => ({
    id: item.id,
    name: item.name,
    isFeature: item.isFeature,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductPage
