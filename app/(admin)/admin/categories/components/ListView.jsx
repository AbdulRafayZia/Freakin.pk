"use client";

import { useConfirm } from "@/app/hooks/useConfirm";
import { useCategories } from "@/lib/firestore/categories/read";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: categories, error, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Organize categories into parent-child structure
  const mainCategories = categories?.filter((cat) => !cat.parentId) || [];
  const subCategories = categories?.filter((cat) => cat.parentId) || [];

  // Create a map of parent categories with their children
  const categoryTree = mainCategories.map((parent) => ({
    ...parent,
    children: subCategories.filter((sub) => sub.parentId === parent.id),
  }));

  let rowIndex = 0;

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <h1 className="text-xl">Categories</h1>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Type
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryTree?.map((parent) => {
            const parentRow = <Row index={rowIndex++} item={parent} key={parent?.id} isParent={true} />;
            const childRows = parent.children.map((child) => (
              <Row index={rowIndex++} item={child} key={child?.id} isParent={false} parentName={parent.name} />
            ));
            return [parentRow, ...childRows];
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index, isParent = true, parentName = "" }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const confirmModal = useConfirm();

  const handleDelete = async () => {
    if (!(await confirmModal("Are you sure?"))) return;

    setIsDeleting(true);
    try {
      await deleteCategory({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/categories?id=${item?.id}`);
  };

  return (
    <tr className={!isParent ? "bg-gray-50" : ""}>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <img className="h-10 w-10 object-cover rounded" src={item?.imageURL} alt="" />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className={!isParent ? "pl-6 flex items-center gap-2" : ""}>
          {!isParent && <span className="text-gray-400">↳</span>}
          <span className={isParent ? "font-semibold" : ""}>{item?.name}</span>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        {isParent ? (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
            Main Category
          </span>
        ) : (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            Sub of: {parentName}
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
