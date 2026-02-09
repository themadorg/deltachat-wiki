---
title: Referencia de autorización del remitente
description: Referencia para el módulo check.authorize_sender, que garantiza que las direcciones del remitente pertenecen al usuario autenticado.
category: Técnico
---

# Autorización de MAIL FROM y From

El módulo check.authorize_sender verifica que las direcciones del remitente del sobre (envelope) y del encabezado pertenecen al usuario autenticado. La propiedad de la dirección se establece mediante una tabla que asigna cada cuenta de usuario a una dirección de correo electrónico que se le permite utilizar. Hay algunos casos especiales, consulta la descripción de `user_to_email` más abajo.

```
check.authorize_sender {
    prepare_email identity
    user_to_email identity
    check_header yes

    unauth_action reject
    no_match_action reject
    malformed_action reject
    err_action reject

    auth_normalize auto
    from_normalize auto
}
```
```
check {
    authorize_sender { ... }
}
```

## Directivas de configuración

### user_to_email _tabla_
Por defecto: `identity`

Tabla que asigna el nombre de usuario de autorización a la lista de correos electrónicos del remitente que el usuario tiene permitido utilizar.

Además de las direcciones de correo electrónico, la tabla puede contener nombres de dominio o la cadena especial "\*" como valor. Si el valor es un dominio, el usuario podrá utilizar cualquier buzón dentro de él como dirección de remitente. Si es "\*", el usuario podrá utilizar cualquier dirección.

Por defecto, se utiliza table.identity, lo que significa que el nombre de usuario debe ser igual al correo electrónico del remitente.

Antes de buscar el nombre de usuario en la tabla, se le aplica el algoritmo de normalización definido por `auth_normalize`.

---

### prepare_email _tabla_
Por defecto: `identity`

Tabla que se utiliza para traducir las direcciones de correo electrónico antes de que se comparen con los valores de `user_to_email`.

Se utiliza normalmente para permitir que los usuarios utilicen sus alias como direcciones de remitente; en este caso, `prepare_email` debe traducir los alias a las direcciones "canónicas". Así es como se hace en la configuración por defecto.

Si la tabla no contiene ningún mapeo para la dirección del remitente utilizada, se utilizará tal cual.

---

### check_header _booleano_
Por defecto: `yes`

Indica si se debe verificar el remitente del encabezado además del sobre.

El valor del campo Sender o del campo From debe coincidir con la identidad de autorización.

---

### unauth_action _acción_
Por defecto: `reject`

Qué hacer si el usuario no está autenticado en absoluto.

---

### no_match_action _acción_
Por defecto: `reject`

Qué hacer si el usuario no tiene permitido utilizar la dirección de remitente especificada.

---

### malformed_action _acción_
Por defecto: `reject`

Qué hacer si los campos de encabezado From o Sender contienen valores mal formados.

---

### err_action _acción_
Por defecto: `reject`

Qué hacer si ocurre un error durante la búsqueda en `prepare_email` o `user_to_email`.

---

### auth_normalize _acción_
Por defecto: `auto`

Función de normalización a aplicar al nombre de usuario de autorización antes de continuar con el procesamiento.

Opciones disponibles:

- `auto` – `precis_casefold_email` para correos válidos, `precis_casefold` en caso contrario.
- `precis_casefold_email` – perfil PRECIS UsernameCaseMapped + forma U-labels para el dominio.
- `precis_casefold` – perfil PRECIS UsernameCaseMapped para toda la cadena.
- `precis_email` – perfil PRECIS UsernameCasePreserved + forma U-labels para el dominio.
- `precis` – perfil PRECIS UsernameCasePreserved para toda la cadena.
- `casefold` – convertir a minúsculas.
- `noop` – nada.

Los perfiles PRECIS están definidos por el RFC 8265. En resumen, aseguran que las cadenas Unicode que parecen iguales se comparen como si fueran iguales. Los perfiles CaseMapped también convierten las cadenas a minúsculas.

---

### from_normalize _acción_
Por defecto: `auto`

Función de normalización a aplicar a las direcciones de correo electrónico antes de continuar con el procesamiento.

Las opciones disponibles son las mismas que para `auth_normalize`.
