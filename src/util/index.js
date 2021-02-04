import { MediaStatus, MediaListStatus } from "anilist-wrapper";
import axios from "axios";

export const maxEpisodesBeforePagination = 20;

export const formatEpisodes = (anime) => {
  let eps;

  if (
    anime.media.episodes === null ||
    anime.media.status === MediaStatus.Releasing
  ) {
    eps = "?";
  } else {
    eps = anime.media.episodes;
  }

  const progress = anime.progress ? anime.progress : 0;
  return " (" + progress + "/" + eps + ")";
};

export const formatListStatus = (status) => {
  switch (status) {
    case MediaListStatus.Current:
      return "Currently watching";
    case MediaListStatus.Completed:
      return "Completed";
    case MediaListStatus.Paused:
      return "Paused";
    case MediaListStatus.Dropped:
      return "Dropped";
    case MediaListStatus.Planning:
      return "Planning to watch";
  }
};

export const formatAnimeStatus = (status) => {
  switch (status) {
    case MediaStatus.Finished:
      return "Finished";
    case MediaStatus.Cancelled:
      return "Cancelled";
    case MediaStatus.Hiatus:
      return "Hiatus";
    case MediaStatus.Releasing:
      return "Releasing";
    case MediaStatus.NotYetReleased:
      return "Not Yet Released";
  }
};

export const epsToRender = (from, to) => {
  const episodesToRender = [];
  while (from <= to) {
    episodesToRender.push(from++);
  }
  return episodesToRender;
};

export const calcRanges = (anime) => {
  const { status } = anime;
  let { nextAiringEpisode } = anime;
  let { episodes } = anime;
  if (status === MediaStatus.NotYetReleased) {
    return [];
  }
  const totalEpisodes = totalEps(nextAiringEpisode, episodes);

  const rangeCount = Math.ceil(totalEpisodes / maxEpisodesBeforePagination);

  const ranges = [];

  var base = 1;
  var end = 21;

  for (var i = 0; i < rangeCount; i++) {
    if (end >= totalEpisodes) {
      end = totalEpisodes;
    }
    ranges.push({
      from: base,
      to: end,
    });
    base = end + 1;
    end = end + 20;
  }
  return ranges;
};

const API = "https://sushi-night-backend.herokuapp.com/api/anime";

export async function getIdFromGogo(anime) {
  let idList = [];
  const totalEpisodes = totalEps(anime.nextAiringEpisode, anime.episodes);
  let otherNames = "";
  const year = anime.startDate.year;

  let valuesArray = Object.values(anime.title);

  valuesArray = valuesArray.filter((v, i) => valuesArray.indexOf(v) == i);

  for (let titleFormat of valuesArray) {
    //sometimes they are null thats why i check
    if (titleFormat) otherNames += titleFormat + ",";
  }
  otherNames = otherNames.slice(0, -1); //remove last comma.
  await axios
    .get(
      `${API}/getId/${anime.title.romaji}/${totalEpisodes}/${otherNames}/${year}`
    )
    .then((ids) => {
      idList = ids.data[0];
    })
    .catch((err) => console.log(err));

  console.log("return " + JSON.stringify(idList));
  return idList;
}

const totalEps = (nextAiringEpisode, episodes) =>
  nextAiringEpisode ? nextAiringEpisode.episode - 1 : episodes;

export async function getEpisodeLinks(id, episode) {}
