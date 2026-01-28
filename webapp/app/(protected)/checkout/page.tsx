"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios, { isAxiosError } from "axios";
import { CheckoutForm } from "@/components/checkout";
import { Card } from "@/components/ui/card";
// Importamos los tipos, aunque usaremos 'any' en la respuesta para evitar errores de estructura
import { BackendErrorResponse } from "@/types";
import { AUTH_TOKEN_KEY } from "@/lib";
import { useCartStore } from "@/stores/cart.store";

// Inicializamos Stripe fuera del componente
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
interface PaymentIntentResponse {
  clientSecret?: string;
  data?: { clientSecret: string };
  client_secret?: string;
}
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado extra para control visual
  const router = useRouter();
  const { total, cart } = useCartStore();
  useEffect(() => {
    // 1. CORRECCIÓN: Usamos el nombre real de tu token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      // 2. CORRECCIÓN: La ruta real es /login (sin auth/)
      router.push("/login");
      return;
    }

    const initPayment = async () => {
      try {
        console.log("🚀 Iniciando petición de pago...");
        if (!cart || cart.items.length === 0) {
          setError("Tu carrito está vacío.");
          setIsLoading(false);
          return;
        }

        const itemsParaBackend = cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        console.log("📤 Enviando al backend:", {
          amount: total,
          items: itemsParaBackend,
        });

        const { data } = await axios.post<PaymentIntentResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`,
          {
            // Muchos backends de Stripe esperan el total en centavos (total * 100)
            // Intenta primero con 'total' y si falla prueba: amount: Math.round(total * 100)
            amount: total,
            items: itemsParaBackend,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const secret =
          data.clientSecret || data.data?.clientSecret || data.client_secret;

        if (secret) {
          setClientSecret(secret);
        } else {
          setError("El servidor no envió la llave de pago.");
        }
      } catch (err: unknown) {
        let errorMessage = "Error al iniciar el pago.";
        if (isAxiosError(err)) {
          const backendData = err.response?.data as
            | BackendErrorResponse
            | undefined;
          errorMessage =
            backendData?.message || `Error: ${err.response?.status}`;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    void initPayment();
    // Agregamos las dependencias para que el efecto se actualice si el carrito cambia
  }, [router, total, cart, isLoading]);

  // Renderizado Condicional

  // 1. Estado de Carga Inicial
  if (isLoading && !clientSecret && !error) {
    return (
      <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <div className="text-lg font-medium">Conectando con Stripe...</div>
        <p className="text-sm text-gray-500 mt-2">
          Por favor no recargues la página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      <div className="max-w-xl mx-auto">
        {error ? (
          // 2. Estado de Error
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">¡Ups! Ocurrió un error.</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded text-sm transition"
            >
              Reintentar
            </button>
          </div>
        ) : (
          // 3. Estado de Éxito (Formulario)
          <Card className="p-6 shadow-md bg-white">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
