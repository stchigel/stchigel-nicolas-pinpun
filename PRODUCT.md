# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite en `Frontend/` (exigido por la consigna), consumiendo la API Express de `Backend/` (`/api/...`, respuestas `{ success, data | message }`). Navegación con react-router. Peticiones centralizadas en `Frontend/src/services`.

## Users

- **Visitante / cliente**: vecino o turista que quiere ver el menú de su sucursal, pedir delivery o retiro, o reservar mesa.
- **Administrador de sucursal**: carga stock y platos de su local, administra pedidos y reservas.
- **Administrador general**: gestiona todas las sucursales.

## Product Purpose

Sitio y sistema de pedidos/reservas de Pizzería Pin Pun: ver locales y el más cercano, ver el menú por local con stock, armar carrito y pedir (delivery o retiro), reservar mesa, y paneles de administración.

## Positioning

Pin Pun, fundada en 1927 en Almagro (Av. Corrientes 3954), es considerada la pizzería más antigua de CABA; la fundaron los mismos inmigrantes italianos que luego abrieron Güerrín. Se define como "bodegón porteño". Premios: mejor pizzería (Buenos Aires Capital Gastronómica 2018), mejor muzzarella (Muzza 5K 2015).

## Operating Context

Locales (Instagram confirmado por el usuario): Almagro, Av. Corrientes 3954 (@pinpuncorrientes); Angelina, Av. Corrientes 5600, Villa Crespo (@pinpunangelina); Villa Urquiza, La Pampa 5201 (@pinpunurquiza); Monte Castro, Av. Lope de Vega 1650 (@pinpunmontecastro); Lanús, Av. Hipólito Yrigoyen 4485, Lanús Oeste (@pinpunlanus); Lomas de Zamora, Colombres 606 (@pinpunlomas). Horarios confirmados solo en parte (ver Backend/src/repositories/localRepository.js). Barra para comer de parado, pizzeros a la vista, botella de moscato en cada mesa.

## Capabilities and Constraints

- Reglas: no pedidos ni reservas fuera de horario; reservas sujetas a disponibilidad; cantidades limitadas por capacidad del local.
- Estados de pedido delivery: Recibido, En preparación, Listo, En camino, Entregado (o Cancelado). Retiro: Recibido, En preparación, Listo, Retirado (o Cancelado). Reserva: Esperando confirmación, Aceptada, Rechazada, Concluida.
- Consigna académica: componentes reutilizables, notificaciones laterales (no `alert()`), estados de carga, validación de formularios, confirmación antes de eliminar, accesibilidad básica, respetar el boceto `Diseño-pinpun.pdf`.

## Brand Commitments

Ver `pin-pun-relevamiento-diseno.md`: rojo `#C1121F`, verde `#1E4D3A`, blanco hueso `#F3F1EB`, mantel a cuadros rojo y blanco como firma, titulares condensados en mayúsculas, serif slab para lectura, logo en óvalo rojo con filete blanco. Tono voseante, cercano, de barrio y de cancha.

## Evidence on Hand

- Fotos reales: las provee el usuario (pendientes). No usar fotos de stock genéricas ni presentar imágenes ajenas como propias.
- Sin testimonios ni reseñas: no inventarlos. Los premios citados provienen del relevamiento de prensa.

## Product Principles

1. La historia es el argumento: casi 100 años, el dato real antes que el adjetivo.
2. El menú y el local primero: lo que el visitante vino a buscar está a un clic.
3. Barrio antes que marca corporativa: cercano, festivo, porteño.
4. Toda acción tiene respuesta visible (carga, éxito, error).

## Accessibility & Inclusion

Accesibilidad básica exigida por la consigna: HTML semántico, labels asociados, botones reales, textos alternativos, navegación clara, foco visible.
