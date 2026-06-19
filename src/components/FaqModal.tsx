"use client";

import { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";

const PHONE_NUMBERS = [
  { label: "+53 56659558", dial: "+5356659558", wa: "5356659558" },
  { label: "+53 58971068", dial: "+5358971068", wa: "5358971068" },
];

function FaqSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-1 text-left cursor-pointer hover:text-accent transition-colors"
      >
        <span className="text-sm font-medium">{title}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-4 px-1 text-sm text-muted-foreground leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function PhoneActions({
  number,
  onClose,
}: {
  number: (typeof PHONE_NUMBERS)[number];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-9999999 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-xs mx-auto p-5 border border-border">
        <p className="text-sm font-medium text-center mb-4">{number.label}</p>
        <div className="flex flex-col gap-2">
          <a
            href={`tel:${number.dial}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-background bg-accent cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            Llamar
          </a>
          <a
            href={`https://wa.me/${number.wa}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-foreground border border-border-light cursor-pointer hover:border-accent transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={onClose}
            className="py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export function FaqModal({ onCloseAction }: { onCloseAction: () => void }) {
  const [phoneTarget, setPhoneTarget] = useState<
    (typeof PHONE_NUMBERS)[number] | null
  >(null);

  return (
    <div className="fixed inset-0 z-999999 bg-black/60 flex items-end sm:items-center justify-center">
      <div
        className="w-full max-w-lg mx-auto max-h-[85vh] overflow-y-auto border border-border"
        style={{ background: "rgba(15, 23, 42, 0.97)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 sticky top-0 z-10 border-b border-border bg-border/90">
          <h2 className="font-semibold text-base">Preguntas Frecuentes</h2>
          <button
            onClick={onCloseAction}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-2">
          {/* 1. ¿Qué es MipyMap? */}
          <FaqSection title="¿Qué es MipyMap?">
            <p>
              MipyMap es un directorio interactivo en forma de mapa digital
              donde puedes encontrar todas las Micro, Pequeñas y Medianas
              Empresas (MiPyMEs) de la provincia de Cienfuegos.
            </p>
            <p>
              Piensa en ello como una guía telefónica visual: en lugar de buscar
              en una lista de nombres, ves un mapa con marcadores que indican
              dónde está cada negocio. Al hacer clic en un marcador, puedes ver
              el nombre del negocio, su horario, si acepta transferencia, y
              todos los productos que ofrece con sus precios.
            </p>
            <p>
              Es completamente gratuito y funciona desde el navegador de tu
              teléfono o computadora, sin necesidad de descargar ninguna
              aplicación.
            </p>
          </FaqSection>

          {/* 2. ¿Qué resuelve MipyMap? */}
          <FaqSection title="¿Qué resuelve MipyMap?">
            <p>
              MipyMap resuelve un problema muy sencillo pero frustrante:{" "}
              <strong>encontrar qué hay cerca de ti y dónde comprarlo</strong>.
            </p>
            <p className="font-medium text-foreground mt-3">
              Ejemplos prácticos:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Necesitas pan:</strong> Abres MipyMap, buscas
                &ldquo;pan&rdquo; en la búsqueda de productos, y te muestra
                todas las mipymes que venden pan cerca de ti, ordenadas por
                precio o distancia.
              </li>
              <li>
                <strong>Quieres saber si una mipyme está abierta:</strong> El
                mapa te muestra el horario de cada negocio y si está abierto o
                cerrado en este momento.
              </li>
              <li>
                <strong>Quieres pagar con transferencia:</strong> Puedes filtrar
                para ver solo las mipymes que aceptan transferencia bancaria.
              </li>
              <li>
                <strong>Eres dueño de un negocio:</strong> Puedes registrar tu
                mipyme, agregar tus productos con precios, y controlar el stock
                desde tu propio panel.
              </li>
            </ul>
          </FaqSection>

          {/* 3. ¿Cómo usar MipyMap? */}
          <FaqSection title="¿Cómo usar MipyMap?">
            <p className="font-medium text-foreground">
              Para el público (buscar productos):
            </p>
            <ol className="list-decimal pl-5 space-y-1 mt-1">
              <li>
                Al entrar a la página principal verás un mapa de Cienfuegos con
                puntos (marcadores) que representan las mipymes registradas.
              </li>
              <li>
                Puedes hacer clic en cualquier marcador para ver información del
                negocio y sus productos.
              </li>
              <li>
                Usa la lupa o la página de &ldquo;Buscar&rdquo; para encontrar
                productos específicos por su nombre (ej: &ldquo;arroz&rdquo;,
                &ldquo;pan&rdquo;, &ldquo;huevos&rdquo;).
              </li>
              <li>
                En la página &ldquo;Lista&rdquo; puedes filtrar los resultados
                por más baratos, cercanía, transferencia, o solo los que están
                abiertos ahora.
              </li>
              <li>
                Para ver tu ubicación en el mapa, toca el botón con el ícono de
                ubicación (círculo con un punto dentro) — tu teléfono te pedirá
                permiso para usar la ubicación.
              </li>
            </ol>

            <p className="font-medium text-foreground mt-4">
              Para dueños de mipymes (panel de negocio):
            </p>
            <ol className="list-decimal pl-5 space-y-1 mt-1">
              <li>
                El administrador registra tu mipyme y te da un usuario y
                contraseña.
              </li>
              <li>
                Entras en &ldquo;Iniciar Sesión&rdquo; con tu usuario y
                contraseña.
              </li>
              <li>
                Una vez dentro, puedes agregar, editar o eliminar tus productos,
                y controlar cuánto stock tienes disponible.
              </li>
              <li>
                Todos los cambios se ven reflejados al instante en el mapa y en
                la búsqueda.
              </li>
            </ol>
          </FaqSection>

          {/* 4. ¿Cómo agrego mi Mipyme? */}
          <FaqSection title="¿Cómo agrego mi Mipyme?">
            <p>
              Si eres dueño de una mipyme y quieres aparecer en MipyMap, debes
              contactar con el administrador a través de los números que
              aparecen en la sección de Contacto de esta misma página.
            </p>
            <p className="mt-2">
              El administrador registrará tu negocio en el sistema y te
              proporcionará un usuario y una contraseña para que puedas
              gestionar tus productos y precios desde tu propio panel.
            </p>
            <p className="mt-2">
              Por el momento, el registro no está disponible de forma automática
              para garantizar que solo aparezcan negocios verificados de la
              provincia de Cienfuegos.
            </p>
          </FaqSection>

          {/* 5. Contacto */}
          <FaqSection title="Contacto">
            <p>
              Si tienes dudas, quieres registrar tu mipyme, o necesitas ayuda,
              puedes contactarnos a través de los siguientes números:
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {PHONE_NUMBERS.map((num) => (
                <button
                  key={num.label}
                  onClick={() => setPhoneTarget(num)}
                  className="flex items-center gap-2 py-2 px-3 border border-border-light text-sm text-foreground cursor-pointer hover:border-accent transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  {num.label}
                </button>
              ))}
            </div>
          </FaqSection>

          {/* Footer / Developer credit */}
          <div className="py-4 text-center text-xs text-muted">
            <p>
              Developed by{" "}
              <a
                href="https://denisio04.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Denis Rodriguez
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Phone action modal */}
      {phoneTarget && (
        <PhoneActions
          number={phoneTarget}
          onClose={() => setPhoneTarget(null)}
        />
      )}
    </div>
  );
}
