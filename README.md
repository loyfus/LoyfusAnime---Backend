# API de Animes 🌟

Esta é uma **API** desenvolvida com **Node.js** e **Express** que fornece informações sobre animes populares utilizando dados da **AniList**. A API permite acessar uma lista dos principais animes e detalhes completos sobre cada um, incluindo títulos, descrições, episódios, gêneros e locais de streaming.

## Funcionalidades 🚀

A API possui duas principais funcionalidades:

### 1. **Obter os animes mais populares** 🎬
   - **Endpoint**: `/`
   - **Método**: `GET`
   - **Parâmetros**:
     - `page`: Número da página de resultados (padrão: **1**)
     - `perPage`: Quantidade de animes por página (padrão: **20**)
   - **Descrição**: Retorna uma lista dos animes mais populares com informações como **id**, **título** e **imagem de capa**.

### 2. **Obter detalhes de um anime específico** 📖
   - **Endpoint**: `/:id`
   - **Método**: `GET`
   - **Parâmetro**:
     - `id`: **ID** do anime (obtido através da resposta do endpoint anterior)
   - **Descrição**: Retorna detalhes completos sobre o anime, incluindo:
     - **Título** (romaji, inglês e nativo)
     - **Descrição limpa**
     - **Número de episódios**
     - **Gêneros**
     - **Imagem de capa**
     - **Episódios de streaming disponíveis**
