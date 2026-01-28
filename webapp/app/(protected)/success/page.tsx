import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SuccessPage() {
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

        <Link href="/products">
          <Button className="w-full">Seguir comprando</Button>
        </Link>
      </Card>
    </div>
  );
}
