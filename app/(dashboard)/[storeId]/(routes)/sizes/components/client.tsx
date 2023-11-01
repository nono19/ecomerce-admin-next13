"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SizeColoum, columns } from "./coloumns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface SizeClientProps {
  data: SizeColoum[]
}

export const SizeClient: React.FC<SizeClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="manage size for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading 
        title="API"
        description="Api Calls for Sizes"
      />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  )
}