using System;
using System.Collections.Generic;
using Back.SLTA.Domain.Entities;
using Back.SLTA.Domain.Enums;
using Back.SLTA.Domain.ValueObjects;

namespace Back.SLTA.Infrastructure.Configurations;

public static class DataSeeder
{
    public static IReadOnlyCollection<Publication> GetInitialPublications()
    {
        var randomSeed = new List<Publication>
        {
            Publication.Restore(
                Guid.Parse("6b6e0a58-6d5f-4b40-9b38-918af584dc4d"),
                "Libro de Cálculo II",
                "Edición actualizada del libro de cálculo, en excelente estado.",
                PublicationType.Article,
                UserProfile.Create("Laura Gómez", "Ingeniería Civil"),
                "https://picsum.photos/200?random=1",
                Price.Create(35000, "COP"),
                null,
                "https://randomuser.me/api/portraits/women/44.jpg"),
            Publication.Restore(
                Guid.Parse("2c07e769-19a4-4b43-9d4e-ffbd40a1486d"),
                "Clases particulares de programación",
                "Ofrezco tutorías personalizadas para principiantes en Java y Python.",
                PublicationType.Service,
                UserProfile.Create("Carlos Pérez", "Ingeniería de Sistemas"),
                "https://picsum.photos/200?random=2",
                Price.Create(25000, "COP"),
                "+57 300 123 4567",
                "https://randomuser.me/api/portraits/men/46.jpg"),
            Publication.Restore(
                Guid.Parse("14fe71c6-9e8c-4c6c-9c28-75dfc61e4030"),
                "Transporte a la sede norte",
                "Viajo todos los días desde Bosa hasta la sede norte, cupo disponible.",
                PublicationType.Service,
                UserProfile.Create("Daniel Rojas", "Derecho"),
                "https://picsum.photos/200?random=3",
                Price.Create(10000, "COP"),
                "+57 301 456 7890",
                "https://randomuser.me/api/portraits/men/52.jpg"),
            Publication.Restore(
                Guid.Parse("bc13fb94-ea64-4ab0-9710-f589a8dcbf1f"),
                "Busco compañero para proyecto de IA",
                "Necesito alguien que sepa un poco de Python y machine learning.",
                PublicationType.Request,
                UserProfile.Create("María Torres", "Ingeniería de Sistemas"),
                "https://picsum.photos/200?random=4",
                null,
                null,
                "https://randomuser.me/api/portraits/women/65.jpg"),
            Publication.Restore(
                Guid.Parse("0f7cf9f3-0fb8-4c3e-b6d1-f0a236d30322"),
                "Venta de portátil HP",
                "Laptop HP i5, 8GB RAM, SSD 512GB. Perfecto estado.",
                PublicationType.Article,
                UserProfile.Create("Santiago Ruiz", "Arquitectura"),
                "https://picsum.photos/200?random=5",
                Price.Create(1500000, "COP"),
                "+57 320 234 5678",
                "https://randomuser.me/api/portraits/men/60.jpg"),
            Publication.Restore(
                Guid.Parse("f86a3d3e-dae3-4ed9-84c2-d4bd5c75fcb4"),
                "Diseño de logos para proyectos",
                "Hago diseño de logos e identidades visuales para tus emprendimientos.",
                PublicationType.Service,
                UserProfile.Create("Valentina Cárdenas", "Diseño Gráfico"),
                "https://picsum.photos/200?random=6",
                Price.Create(40000, "COP"),
                "+57 304 765 4321",
                "https://randomuser.me/api/portraits/women/48.jpg"),
            Publication.Restore(
                Guid.Parse("ff643c1b-8ba3-4a3a-8d09-26cad0a1d95e"),
                "Busco clases de matemáticas financieras",
                "Estoy buscando un tutor que me ayude con la materia.",
                PublicationType.Request,
                UserProfile.Create("Andrés López", "Administración de Empresas"),
                "https://picsum.photos/200?random=7",
                null,
                "+57 305 987 6543",
                "https://randomuser.me/api/portraits/men/70.jpg"),
            Publication.Restore(
                Guid.Parse("f6cb5e52-b80b-4f7e-9c6f-9b8ebac03702"),
                "Venta de bicicleta usada",
                "Bicicleta GW en buen estado, poco uso, ideal para ciudad.",
                PublicationType.Article,
                UserProfile.Create("Camila Rodríguez", "Ingeniería Ambiental"),
                "https://picsum.photos/200?random=8",
                Price.Create(380000, "COP"),
                "+57 310 246 8101",
                "https://randomuser.me/api/portraits/women/50.jpg")
        };

        return randomSeed;
    }
}
