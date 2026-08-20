# Snapshots locais de calendários

Esta pasta recebe, somente no ambiente local, os arquivos usados para gerar a
disponibilidade estática:

- `casa-turquesa.ics`
- `casa-corais.ics`

Os arquivos `.ics` são ignorados pelo Git porque podem conter identificadores e
informações internas. O navegador nunca acessa esta pasta; ele recebe apenas os
intervalos normalizados de `src/generated/availability.json`.
