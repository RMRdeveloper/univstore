"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";
import { ordersService } from "@/services";
import { Button, Card } from "@/components/ui";
import { formatPrice, getImageUrl } from "@/lib";
import type { Order, OrderItem } from "@/types";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await ordersService.getOrderById(id);
        setOrder(data);
        setError(null);
      } catch {
        setError("No se pudo cargar la orden.");
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error ?? "Orden no encontrada."}
        </p>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          Volver a Mis Órdenes
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const productName = (item: OrderItem): string =>
    typeof item.product === "object" && item.product !== null && "name" in item.product
      ? (item.product as { name?: string }).name ?? "Producto"
      : "Producto";
  const productImages = (item: OrderItem): string[] =>
    typeof item.product === "object" && item.product !== null && "images" in item.product
      ? ((item.product as { images?: string[] }).images ?? [])
      : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Órdenes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Orden #{order.id.slice(-8)}
        </h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 capitalize">
          {order.status}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {formatDate(order.createdAt)}
      </p>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Productos
        </h2>
        <ul className="space-y-4">
          {order.items.map((item, index) => {
            const productId = typeof item.product === "object" && item.product !== null && "id" in item.product
              ? (item.product as { id: string }).id
              : String(index);
            return (
            <li
              key={productId}
              className="flex gap-4 py-3 border-b border-gray-200 dark:border-slate-700 last:border-0"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                {productImages(item).length > 0 ? (
                  <Image
                    src={getImageUrl(productImages(item)[0])}
                    alt={productName(item)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-slate-100 truncate">
                  {productName(item)}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {item.quantity} × {formatPrice(item.priceAtPurchase)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900 dark:text-slate-100">
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </p>
              </div>
            </li>
          );
          })}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Total
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-slate-100">
            {formatPrice(order.total)}
          </span>
        </div>
      </Card>
    </div>
  );
}
