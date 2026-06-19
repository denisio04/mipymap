import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCT_POOL = [
  "Pan",
  "Pan Francés",
  "Pan Dulce",
  "Pan Integral",
  "Pan de Ajo",
  "Arroz",
  "Frijoles",
  "Huevos",
  "Leche",
  "Queso",
  "Café",
  "Azúcar",
  "Aceite",
  "Sal",
  "Harina",
  "Pollo",
  "Cerdo",
  "Res",
  "Pescado",
  "Camaron",
  "Tomate",
  "Cebolla",
  "Ajo",
  "Plátano",
  "Yuca",
  "Boniato",
  "Malanga",
  "Calabaza",
  "Lechuga",
  "Zanahoria",
  "Pimiento",
  "Refresco",
  "Cerveza",
  "Ron",
  "Agua",
  "Jugo",
  "Galletas",
  "Galletas de Mantequilla",
  "Dulce",
  "Chocolate",
  "Helado",
  "Yogur",
  "Pastel de Chocolate",
  "Cemento (saco)",
  "Varilla de Acero",
  "Pintura Blanca (galón)",
  "Clavos (libra)",
  "Camisa de Vestir",
  "Pantalón Vaquero",
  "Vestido Elegante",
];

const MUNICIPALITIES = [
  "Cienfuegos",
  "Cruces",
  "Palmira",
  "Rodas",
  "Abreus",
  "Aguada de Pasajeros",
];

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10000) / 10000;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Limpiando datos existentes...");

  await prisma.$executeRawUnsafe("DELETE FROM products");
  await prisma.$executeRawUnsafe("DELETE FROM mipymes");
  await prisma.$executeRawUnsafe("DELETE FROM users");

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin creado: admin / admin123");

  console.log("Creando 50 mipymes con 50 productos cada una...");

  const mipymePassword = await bcrypt.hash("mipyme123", 10);

  for (let i = 1; i <= 50; i++) {
    const lat = randomFloat(22.12, 22.18);
    const lng = randomFloat(-80.47, -80.42);
    const municipality = pick(MUNICIPALITIES);

    // 2 mipymes con horario nocturno (abiertas a 1:53 AM), el resto diurno
    const openingTime = i <= 2 ? "22:00" : "08:00";
    const closingTime = i <= 2 ? "06:00" : "17:00";

    await prisma.user.create({
      data: {
        username: `mipyme${i}`,
        password: mipymePassword,
        role: "MIPYME",
        mipyme: {
          create: {
            name: `Mipyme ${i}`,
            lat,
            lng,
            acceptsTransfer: Math.random() > 0.4,
            openingTime,
            closingTime,
            province: "Cienfuegos",
            municipality,
            image: `https://placehold.co/400x400/1e293b/38bdf8?text=Mipyme+${i}`,
            products: {
              create: Array.from({ length: 50 }, () => {
                const productName = pick(PRODUCT_POOL);
                return {
                  name: productName,
                  quantity: Math.floor(Math.random() * 100) + 1,
                  price: randomFloat(10, 500),
                };
              }),
            },
          },
        },
      },
    });

    if (i % 10 === 0) {
      console.log(`  Creadas ${i} mipymes...`);
    }
  }

  console.log("¡Seed completado! 50 mipymes con 2500 productos creados.");
  console.log("Usuario admin: admin / admin123");
  console.log("Usuario mipyme: mipyme1 / mipyme123 (mipyme1 hasta mipyme50)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
