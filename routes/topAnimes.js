const express = require('express');
const axios = require('axios');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

const cleanDescription = (description) => {
  let cleanedDescription = description.replace(/<br\s*\/?>/gi, '\n');
  cleanedDescription = cleanedDescription.replace(/<\/?[^>]+(>|$)/g, "");
  cleanedDescription = cleanedDescription.replace(/\r?\n|\r/g, ' '); 
  return cleanedDescription.trim();
};

const getTopAnimes = async (page = 1, perPage = 40) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              media(sort: POPULARITY_DESC, type: ANIME) {
                id
                title {
                  english
                }
                coverImage {
                  extraLarge
                }
              }
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
            }
          }
        `,
        variables: { page, perPage },
      });
  
      return response.data.data.Page;
    } catch (error) {
      console.error('Erro ao buscar dados da AniList:', error);
      return null;
    }
  };

const getAnimeDetails = async (id) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
              description
              episodes
              genres
              coverImage {
                extraLarge
              }
              streamingEpisodes {
                title
                url
                site
              }
            }
          }
        `,
        variables: { id }
      });
  
      const data = response.data.data.Media;
  
      // Limpa a descrição do anime
      const cleanDesc = cleanDescription(data.description);
  
      return {
        id: data.id,
        title: data.title,
        description: cleanDesc,
        episodes: data.episodes,
        genres: data.genres,
        coverImage: data.coverImage.extraLarge,
        streamingEpisodes: data.streamingEpisodes || [], // Retorna os locais de streaming
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do anime:', error);
      return null;
    }
};  

router.get('/', async (req, res) => {
    const { page = 1, perPage = 20 } = req.query;
  
    const data = await getTopAnimes(parseInt(page), parseInt(perPage));
  
    if (data) {
      res.json({
        animes: data.media.map((anime) => ({
          id: anime.id,
          title: anime.title,
          coverImage: anime.coverImage.extraLarge,
        })),
        pageInfo: data.pageInfo,
      });
    } else {
      res.status(500).send('Erro ao buscar os TOP animes');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await getAnimeDetails(parseInt(id));
  
    if (data) {
      res.json({
        id: data.id,
        title: data.title,
        description: data.description,
        episodes: data.episodes,
        genres: data.genres,
        coverImage: data.coverImage,
        streamingEpisodes: data.streamingEpisodes, // Inclui informações de streaming
      });
    } else {
      res.status(500).send('Erro ao buscar detalhes do anime');
    }
});

module.exports = router;
