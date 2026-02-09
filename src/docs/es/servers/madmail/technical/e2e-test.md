---
title: Conjunto de pruebas E2E
description: Descripción detallada del conjunto de pruebas Delta Chat E2E utilizado para verificar el comportamiento y los protocolos de Madmail.
category: Técnico
---

# Conjunto de pruebas Delta Chat E2E para Madmail

Este documento describe el conjunto de pruebas de extremo a extremo (E2E) para el servidor Madmail, que utiliza el cliente RPC de Delta Chat para simular interacciones de usuarios reales y verificar el comportamiento del servidor.

## Ejecución de las pruebas

### Pruebas de extremo a extremo
El conjunto básico de pruebas E2E utiliza Delta Chat para verificar el comportamiento en el mundo real:

```bash
make test
```

Este comando ejecuta el corredor de pruebas utilizando `uv`:
`uv run python3 tests/deltachat-test/main.py`

### Pruebas unitarias
Para la lógica interna de Go, puedes ejecutar las pruebas unitarias:

```bash
make test-unit
```

### Pruebas E2E selectivas

Puedes ejecutar pruebas específicas o todas las pruebas utilizando argumentos de la línea de comandos:

```bash
# Ejecutar todas las pruebas (por defecto)
uv run python3 tests/deltachat-test/main.py --all

# Ejecutar pruebas específicas
uv run python3 tests/deltachat-test/main.py --test-1 --test-3
```

## Escenarios de prueba

El conjunto consta de varios escenarios ubicados en `tests/deltachat-test/scenarios/`:

### 1. Creación de cuenta (`test_01_account_creation.py`)
- Crea cuentas de prueba aleatorias en los servidores de correo especificados.
- Utiliza el formato `dclogin` para establecer explícitamente los hosts IMAP/SMTP y evitar las búsquedas de DNS.
- Verifica que la cuenta se pueda configurar correctamente e inicie la E/S.

### 2. Rechazo de mensajes no cifrados (`test_02_unencrypted_rejection.py`)
- Intenta enviar un correo electrónico de texto plano (no cifrado) a través de SMTP.
- Verifica que el servidor Madmail lo rechace correctamente con un código de error **523 "Encryption Needed"**.
- Esto asegura que el servidor impone una política de "solo PGP".

### 3. Secure Join (`test_03_secure_join.py`)
- Realiza un apretón de manos de Secure Join entre dos cuentas.
- Verifica que ambas partes se conviertan en "contactos verificados" y establezcan un canal seguro y cifrado con PGP.

### 4. Mensaje cifrado P2P
- Envía un mensaje cifrado de par a par entre dos cuentas verificadas.
- Verifica la entrega exitosa y el descifrado en el extremo del receptor.

### 5. Creación de grupo y mensaje (`test_05_group_message.py`)
- Crea un nuevo chat de grupo multiusuario.
- Añade otro contacto verificado al grupo.
- Verifica que los mensajes de grupo se distribuyan y reciban correctamente por los miembros.

### 6. Transferencia de archivos (`test_06_file_transfer.py`)
- Genera un archivo aleatorio de 1 MB.
- Envía el archivo a través de Delta Chat.
- Verifica la integridad del archivo recibido comparando su **hash SHA256** con el original.

### 7. Federación (`test_07_federation.py`)
- Verifica la mensajería entre servidores entre cuentas en diferentes instancias de Madmail.
- Verifica la mensajería en el mismo servidor entre dos cuentas en la misma instancia.
- Asegura que el cifrado PGP y la entrega funcionen a través de los límites del servidor.

### 8. Prueba de no registro (`test_08_no_logging.py`)
- Esta prueba verifica la naturaleza de "privacidad primero" del servidor.
- Desactiva automáticamente el registro en los servidores remotos a través de SSH.
- Envía un gran volumen de mensajes (más de 30) a través de escenarios P2P, de grupo y de federación.
- Comprueba `journalctl` para asegurar que no se generaron registros (o que fueron mínimos) durante estas operaciones.
- Vuelve a activar automáticamente el registro tras la finalización.

### 9. Transferencia de archivos grandes (`test_09_send_bigfile.py`)
- Pone a prueba el pipeline SMTP/IMAP con múltiples archivos adjuntos de gran tamaño.
- Verifica que `appendlimit` y `max_message_size` se impongan y gestionen correctamente.

### 10. Firma binaria y actualización (`test_10_upgrade_mechanism.py`)
- Verifica la integridad del mecanismo de actualización binaria.
- Prueba tanto las actualizaciones firmadas con éxito como el rechazo de binarios no firmados o manipulados.
- Simula actualizaciones tanto desde archivos locales como desde URLs remotas.

### 11. Registro JIT (`test_11_jit_registration.py`)
- Verifica la creación de cuentas "Just-In-Time".
- Se crea automáticamente una cuenta la primera vez que recibe un correo electrónico o cuando un usuario intenta iniciar sesión, sin registro manual previo.

### 12. Prueba de IDLE SMTP/IMAP (`test_12_smtp_imap_idle.py`)
- Verifica la capacidad de respuesta de la implementación de IMAP IDLE.
- Prueba la recepción de mensajes en tiempo real sin sondeo (polling).
- Asegura que la entrega SMTP active las notificaciones IDLE correctamente.

### 14. Purga de mensajes (`test_14_purge_messages.py`)
- Verifica los comandos administrativos para purgar los datos del usuario.
- Prueba `purge-read` (elimina los mensajes marcados como vistos).
- Prueba `purge-all` (limpia completamente el buzón de una cuenta).
- Verifica el espacio recuperado a través de las estadísticas del servidor.

### 15. Descubrimiento de Iroh (`test_15_iroh_discovery.py`)
- Verifica que el servidor anuncie correctamente la URL del relay de Iroh a través de METADATA de IMAP.
- Asegura que el cliente pueda obtener y analizar la dirección del relay para el establecimiento de la conexión P2P.

### 16. WebXDC Realtime P2P (`test_16_webxdc_realtime.py`)
- Verifica la comunicación P2P de extremo a extremo en tiempo real entre dos instancias de WebXDC.
- Coordina el apretón de manos de Iroh a través del relay de Iroh integrado.
- Verifica que los paquetes de datos de alta frecuencia se entreguen con baja latencia fuera del flujo estándar de IMAP/SMTP.

## Prerrequisitos

- **Entorno Python**: Las pruebas utilizan `uv` para la gestión de dependencias.
- **Servidor RPC de Delta Chat**: El binario `deltachat-rpc-server` debe estar instalado en el sistema.
- **Acceso SSH**: Para pruebas como "No Logging" y para comandos administrativos (Purge), el corredor necesita acceso SSH a los servidores remotos.
- **LXC (Opcional)**: Si se utiliza el flag `--lxc`, el corredor creará automáticamente contenedores aislados para ejecutar las pruebas.

## Resultados y depuración

Los resultados de las pruebas, incluidos los registros del lado del cliente y los del lado del servidor recopilados, se almacenan en un directorio con marca de tiempo en `tmp/test_run_YYYYMMDD_HHMMSS/`:

- `client_debug.log`: Registros detallados del cliente RPC de Delta Chat.
- `server1_debug.log` / `server2_debug.log`: Registros de `journalctl` en los servidores de correo.
- `error.txt`: Contiene los detalles del trazado (traceback) si una prueba falla.
