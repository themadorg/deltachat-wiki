---
title: Referencia del cliente Milter
description: Referencia para el módulo check.milter, que permite la integración de software externo a través del protocolo milter de Sendmail en Madmail.
category: Técnico
---

# Cliente Milter

El módulo 'milter' implementa un subconjunto del protocolo milter de Sendmail que puede utilizarse para integrar software externo con maddy. maddy implementa la versión 6 del protocolo; las versiones anteriores no son compatibles.

Las limitaciones notables de la implementación del protocolo en maddy incluyen:
1. No se admiten cambios en la dirección del remitente del sobre (envelope sender).
2. No se admite la eliminación ni la adición de destinatarios del sobre (envelope recipients).
3. No se admite la eliminación ni la sustitución de campos del encabezado.
4. Los campos de encabezado solo pueden insertarse en la parte superior.
5. El Milter no recibe algunas "macros" proporcionadas por sendmail.

Las restricciones 1 y 2 son inherentes a la interfaz de comprobaciones (checks) de maddy y no pueden eliminarse sin cambios importantes en la misma. Las restricciones 3, 4 y 5 son temporales debido a una implementación incompleta.

```
check.milter {
	endpoint <endpoint>
	fail_open false
}

milter <endpoint>
```

## Argumentos

Cuando se define en línea, el primer argumento especifica el punto final (endpoint) mediante el cual se accede al milter. Ver más abajo.

## Directivas de configuración

### endpoint _esquema://ruta_
Por defecto: no establecido

Especifica el punto final del protocolo milter a utilizar. El punto final se especifica en el formato estándar similar a una URL:
`tcp://127.0.0.1:6669` o `unix:///var/lib/milter/filter.sock`

---

### fail_open _booleano_
Por defecto: `false`

Alterna el comportamiento ante errores de E/S del milter. Si es false ("fail closed"), el mensaje se rechaza con un código de error temporal. Si es true ("fail open"), se omite la comprobación.
