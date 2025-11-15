import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent, IonIcon } from "@ionic/react";
import { cloudyOutline, sunnyOutline, rainyOutline, partlySunnyOutline } from "ionicons/icons";

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 24,
    condition: "Parcialmente nublado",
    location: "Bogotá, Colombia",
    icon: partlySunnyOutline,
  });

  useEffect(() => {
    // Aquí podrías hacer una llamada a una API de clima real
    // Por ahora usamos datos estáticos
    const getWeatherIcon = (condition: string) => {
      const conditionLower = condition.toLowerCase();
      if (conditionLower.includes("soleado") || conditionLower.includes("despejado")) {
        return sunnyOutline;
      } else if (conditionLower.includes("lluvia")) {
        return rainyOutline;
      } else if (conditionLower.includes("nublado")) {
        return cloudyOutline;
      } else {
        return partlySunnyOutline;
      }
    };

    setWeather((prev) => ({ ...prev, icon: getWeatherIcon(prev.condition) }));
  }, []);

  return (
    <IonCard style={{ margin: "0 0 1rem 0" }}>
      <IonCardContent>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: "0", fontSize: "2rem", fontWeight: "bold" }}>{weather.temperature}°C</h2>
            <p style={{ margin: "0.25rem 0 0 0", color: "#666" }}>{weather.condition}</p>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "#999" }}>{weather.location}</p>
          </div>
          <IonIcon icon={weather.icon} style={{ fontSize: "4rem", color: "#FDB813" }} />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default WeatherCard;
