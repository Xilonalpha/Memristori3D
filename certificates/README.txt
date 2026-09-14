MEMRISTORI V10.1.0 — VOLTBUILDER SIGNING

The Android VoltSigner certificate is included as:
certificates/android.p12

VoltSigner alias:
key0

Configured in voltbuilder.json:
- androidAlias = key0
- androidAliasPassword = kakylan123@#@
- androidKeystore = certificates/android.p12
- androidKeystorePassword = kakylan123@#@
- androidPackageType = bundle

IMPORTANT:
This certificate is the same working PKCS12 certificate used by the
successful V5.5.2 build. Keep this certificate and password unchanged for
future Google Play updates, otherwise Play Store signing continuity can fail.
