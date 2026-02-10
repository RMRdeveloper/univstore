"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { apiClient } from "@/lib";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmAndClear = async () => {
      try {
        await apiClient.post("/payments/confirm");
      } catch {
        // Empty cart or other error: still treat as success (e.g. reloaded page)
      }
      try {
        await clearCart();
      } catch {
        // Ignore clear errors; cart may already be empty
      }
    };

    void confirmAndClear();
  }, [clearCart]);

  return (
    <div className="container mx-auto py-20 px-4 flex justify-center">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          ¡Pago Confirmado!
        </h1>
        <p className="text-gray-500 mb-8">
          Tu orden ha sido procesada correctamente.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/orders">
            <Button variant="outline" className="w-full">
              Ver Mis Órdenes
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full">Seguir comprando</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
