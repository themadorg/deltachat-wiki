---
title: Referencia de autenticación Shadow
description: Referencia para el módulo auth.shadow, que permite la autenticación a través de /etc/shadow o un auxiliar setuid en Madmail.
category: Técnico
---

# /etc/shadow

El módulo auth.shadow implementa la autenticación leyendo /etc/shadow. Alternativamente, puede configurarse para utilizar un binario auxiliar como lo hace auth.external.

```
auth.shadow {
    debug no
    use_helper no
}
```

## Directivas de configuración

### debug _booleano_

Por defecto: `no`

Activa el registro detallado para todos los módulos. No necesitas esto a menos que estés informando de un error.

---

### use_helper _booleano_
Por defecto: `no`

Utiliza `LibexecDirectory/maddy-shadow-helper` en lugar de leer directamente `/etc/shadow`. Necesitas usar esto si maddy se está ejecutando como un usuario sin privilegios (por ejemplo, cuando se utilizan cuentas del sistema).

Necesitas hacer que el binario `maddy-shadow-helper` sea setuid; consulta cmd/maddy-shadow-helper/README.md en el árbol de fuentes para más detalles.

Resumen (asumiendo que tienes el grupo maddy):

```
chown root:maddy /usr/lib/maddy/maddy-shadow-helper
chmod u+xs,g+x,o-x /usr/lib/maddy/maddy-shadow-helper
```
