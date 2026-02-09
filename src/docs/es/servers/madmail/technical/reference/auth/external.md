---
title: Referencia de autenticación externa
description: Referencia para el módulo auth.external, que permite a Madmail utilizar binarios auxiliares externos para la autenticación.
category: Técnico
---

# Comando del sistema

Módulo auth.external para la autenticación mediante un binario auxiliar externo. Busca un binario llamado `maddy-auth-helper` en el $PATH y en libexecdir y lo utiliza para la autenticación mediante un par nombre de usuario/contraseña.

El protocolo es muy sencillo:
El programa se lanza por cada autenticación. El nombre de usuario y la contraseña se escriben en stdin, añadiendo \n al final. Si el binario sale con el código de estado 0, la autenticación se considera exitosa. Si el código de estado es 1, la autenticación ha fallado. Si el código de estado es 2, ha ocurrido otro error no relacionado. La información adicional debe escribirse en stderr.

```
auth.external {
    helper /usr/bin/ldap-helper
    perdomain no
    domains ejemplo.org
}
```

## Directivas de configuración

### helper _ruta_al_archivo_

**Requerido.** <br>
Ubicación del binario auxiliar. 

---

### perdomain _booleano_
Por defecto: `no`

No elimina la parte del dominio del nombre de usuario al autenticarse y requiere que esté presente. Puede utilizarse si quieres que usuario@dominio1 y usuario@dominio2 sean cuentas diferentes.

---

### domains _dominios..._
Por defecto: no especificado

Dominios que deben permitirse en el nombre de usuario durante la autenticación.

Por ejemplo, si 'domains' se establece en "dominio1 dominio2", entonces nombre_de_usuario, nombre_de_usuario@dominio1 y nombre_de_usuario@dominio2 serán aceptados como nombres de inicio de sesión válidos, además de simplemente nombre_de_usuario.

Si se utiliza sin 'perdomain', la parte del dominio se eliminará del inicio de sesión antes de comprobarlo con el mecanismo de autenticación subyacente. Si 'perdomain' está configurado, entonces domains también debe configurarse y la parte del dominio **no** se eliminará antes de la comprobación.
