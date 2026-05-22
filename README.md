# Serene Finance • Premium Personal Wealth Assistant

Serene Finance es una aplicación web premium de planificación y control financiero personal mobile-first de alto rendimiento, optimizada especialmente para dispositivos móviles, como el **iPhone**, e inspirada en filosofías de diseño icónicas como **Apple Wallet, Revolut y Stripe**.

La aplicación está diseñada bajo una **arquitectura basada en características** (Feature-based Architecture), utilizando persistencia local offline-first (Zustand + LocalStorage) y sincronización guiada para el motor en la nube de **Supabase**. También cuenta con un módulo de inteligencia artificial de asesoramiento financiero accionado mediante **Gemini AI** a través de un servidor proxy Node.js seguro.

---

## 🚀 Arquitectura del Proyecto

El código fuente está estructurado de manera modular y escalable para evitar acumulación de archivos:

*   `/server.ts`: Servidor full-stack Express + Vite para mediar de forma segura las peticiones hacia Gemini AI sin exponer la clave de API al cliente.
*   `/src/types/finance.ts`: Modelado estricto en TypeScript para transacciones, deudas instrumentadas en cuotas, recordatorios de calendario y metas.
*   `/src/store/financeStore.ts`: Motor de estado unificado Zustand con hidratación local offline-first y datos iniciales de demostración.
*   `/src/utils/categories.ts`: Utilidades visuales, colores de etiquetas, emojis e iconografía Lucide para transacciones.
*   `/src/components/`: Sub-componentes modulares.
    *   `IPhoneContainer.tsx`: Marco interactivo que emula un iPhone 15 Pro en pantallas desktop.
    *   `Onboarding.tsx`: Carrusel de bienvenida interactivo animado por **Framer Motion** para configurar perfil y monedas.
    *   `Navbar.tsx`: Barra de navegación táctil inferior con respuestas fluidas.
    *   `Modals.tsx`: Hojas modulares deslizantes para la inserción de registros.
*   `/src/pages/`: Vistas de rotación de rutas de **React Router**:
    *   `Dashboard.tsx`: Balance general consolidado, resúmenes mensuales y buscador con filtros.
    *   `TransactionsPage.tsx`: Historial de caja completo y calendario inteligente de facturas.
    *   `DebtsPage.tsx`: Tarjetas de deudas con progreso visual de cuotas y abonos instantáneos.
    *   `GoalsPage.tsx`: Metas de ahorro animadas con barra de progresión y depósitos manuales.
    *   `AICoachPage.tsx`: Gráficos dinámicos con **Recharts** e informes automatizados por **Gemini AI** (IA Financiera).
    *   `SettingsPage.tsx`: Preferencias de monedas de Brandon, descargas de copias de seguridad de archivos planos y manuales técnicos.

---

## 📱 Guía de Instalación en iPhone (PWA)

Sigue estas directrices para añadir Serene Finance como una App nativa en tu dispositivo móvil Apple:

1.  Abre el navegador **Safari** en tu iPhone.
2.  Accede a la URL de producción de Serene Finance.
3.  Presiona el botón **Compartir (Share)** (icono de cuadrado con flecha apuntando hacia arriba) en la barra de herramientas inferior de Safari.
4.  Desplázate por el menú y selecciona la opción **Agregar a pantalla de inicio ("Add to Home Screen")**.
5.  Confirma presionando **Agregar (Add)** en la parte superior derecha.
6.  ¡Listo! Lanza la aplicación desde tu pantalla de inicio móvil para disfrutar de la experiencia inmersiva en pantalla completa, libre de barra de direcciones, con soporte offline y notch ajustado de iOS.

---

## ⚡ Conexión con Supabase SQL

Para sincronizar tus datos reales en la nube mediante Supabase, corre las siguientes consultas SQL en el **Editor SQL** del Panel de Supabase para estructurar las relaciones necesarias:

```sql
-- Crear tabla de transacciones de Serene Finance
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(15, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50),
  tags TEXT[],
  notes TEXT,
  icon VARCHAR(50)
);

-- Crear tabla de deudas
CREATE TABLE debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  remaining_amount NUMERIC(15, 2) NOT NULL,
  interest_rate NUMERIC(5, 2) DEFAULT 0,
  total_installments INTEGER DEFAULT 12,
  paid_installments INTEGER DEFAULT 0,
  due_date DATE,
  monthly_payment NUMERIC(15,2)
);

-- Habilitar Políticas Row Level Security (RLS) en Supabase 
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir solo lectura y escritura propia" ON transactions
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🔑 Variables de Entorno

Declara los siguientes parámetros de entorno en tu panel de configuración de Netlify, Cloud Run o archivo local `.env`:

```env
# Gemini API - Requerido para consejero de IA financiera
GEMINI_API_KEY="TU_GEMINI_API_KEY"

# Opcional - Sincronización en la nube mediante Supabase
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-anon-key-de-supabase"
```

---

## ☁️ Instrucciones de Despliegue en Netlify

Si deseas exportar la aplicación y desplegarla en Netlify de forma rápida:

1.  **Construcción Estática**: Corre en tu consola local `npm run build` para compilar el frontend optimizado dentro de la carpeta `/dist/`.
2.  **Configuración de Netlify Redirects**: Crea un archivo opcional `/public/_redirects` con el siguiente contenido para dar soporte a las rutas virtuales de SPA:
    ```text
    /*   /index.html   200
    ```
3.  **Despliegue Directo**: Sube la carpeta `/dist` generada arrastrándola al panel de Netlify Drop, o conecta tu repositorio de GitHub asociando el comando de compilación anterior.
4.  **Backend de IA**: Si vas a desplegar en plataformas hosting de servidor completo (como Cloud Run, Render o Railway), tu script de arranque nativo `npm run start` ejecutará el servidor Express con el proxy de Gemini en el puerto 3000 de forma automática.
