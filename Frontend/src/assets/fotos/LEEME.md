# Fotos de Pin Pun

Las fotos que se guarden acá aparecen solas en el sitio (no hace falta tocar código).
Formatos: `.jpg`, `.jpeg`, `.png`, `.webp` o `.avif`. Mientras una foto no exista, se muestra un dibujo en su lugar.

## Portada e historia (en esta carpeta)

| Archivo         | Dónde aparece                                             | Qué conviene que muestre                            |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `fachada.jpg` | Portada (primera foto, franja ancha 5:2)                   | La fachada roja de Av. Corrientes 3954, horizontal   |
| `salon.jpg`   | Portada (se alterna) e Historia, foto grande (4:3)         | El salón: azulejos negros, piso calcáreo, carteles |
| `pizzero.jpg` | Portada (se alterna) e Historia, foto chica (vertical 4:5) | Un pizzero trabajando a la vista                     |

## Platos (en `productos/`)

El nombre del archivo tiene que coincidir con el campo `imagen` del producto en el backend:

`muzzarella.jpg`, `fugazzeta.jpg`, `napolitana.jpg`, `faina.jpg`, `empanada-carne.jpg`, `calabresa.jpg`, `moscato.jpg`

Las fotos de platos se recortan en proporción 4:3.

## Mitad y mitad (en `mitades/`)

La pizza partida de la sección "Mitad y mitad" se dibuja sola con los ingredientes de cada pizza.
Para reemplazar el dibujo por una foto real, guardar acá una foto **de la pizza entera vista desde arriba, centrada y en proporción cuadrada**, con el nombre `mitad-` + el nombre de la pizza en minúsculas, sin tildes y con guiones:

`mitad-muzzarella.jpg`, `mitad-napolitana.jpg`, `mitad-fugazza.jpg`, `mitad-especial-pin-pun.jpg`, `mitad-jamon-y-morrones.jpg`, `mitad-calabresa.jpg`…

El sitio recorta la mitad que corresponda. Las pizzas sin foto siguen con el dibujo.
