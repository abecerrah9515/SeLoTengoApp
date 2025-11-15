import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton: React.FC = () => {
  const initialOptions = {
    clientId: "AQwt_Vs0Hdx0uaGRZSnjTaEydLacdNpss7tlLxzX59-tBbYG2Xn3dG05bTRxpDKtHRPGreasGl6t1Rz8",
    currency: "USD",
    intent: "capture", // Captura el pago de inmediato
    locale: "es_CO",
  };

  // Crear la orden
  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "5.00", // Monto del pago
          },
        },
      ],
    });
  };

  // Capturar y confirmar el pago
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      alert(`Transacción completada por ${details.payer.name.given_name}`);
    });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div
        style={{
          width: "50%",
          margin: "0 auto",
          backgroundColor: "transparent",
          mixBlendMode: "multiply", // o "overlay" según el fondo
          opacity: 0.9, // lo hace un poco más integrado visualmente
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
