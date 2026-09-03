# Modelo de conteúdo

## Implementado nesta fase

### `siteSettings` — Configurações do Site

Documento singleton com ID fixo `siteSettings`. O Studio fornece navegação direta, remove-o do menu global de criação e não disponibiliza ações de eliminar, duplicar ou despublicar.

Campos iniciais, todos vazios até confirmação oficial:

| Campo técnico | Etiqueta editorial | Tipo | Validação |
| --- | --- | --- | --- |
| `officialName` | Nome oficial | texto | obrigatório para publicar, máximo 160 caracteres |
| `shortName` | Nome curto | texto | máximo 80 caracteres |
| `institutionalDescription` | Descrição institucional | texto longo | máximo 1 200 caracteres |
| `logo` | Logótipo | imagem | hotspot; texto alternativo obrigatório quando existe imagem |
| `generalEmail` | Email geral | email | formato de email |
| `generalPhone` | Telefone geral | texto | máximo 40 caracteres |

O código não cria nem preenche este documento automaticamente.

## Planeado, não implementado

As fases seguintes irão modelar apenas após revisão: página inicial, páginas institucionais, notícias e categorias, serviços, viaturas, formação, galerias, documentos institucionais, pessoas e órgãos, parceiros, recrutamento, sócios/apoio, donativos, contactos e redes sociais.

O modelo completo deve distinguir singletons, documentos reutilizáveis, referências e objetos embebidos sem duplicar conteúdo nem sobrecarregar o editor.
