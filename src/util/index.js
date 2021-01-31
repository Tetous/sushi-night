import { MediaStatus } from "anilist-wrapper";

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

  if (anime.progress) {
    return " (" + anime.progress + "/" + eps + ")";
  } else {
    return eps;
  }
};
