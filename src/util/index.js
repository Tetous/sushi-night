import { Maybe, Media, MediaList, MediaStatus } from "anilist-wrapper/lib";

export function formatMediaListEpisodes(anime: Maybe<MediaList>): string {
  let eps: any;

  if (
    anime.media!.episodes === null ||
    anime.media!.status === MediaStatus.Releasing
  ) {
    eps = "?";
  } else {
    eps = anime.media!.episodes;
  }

  return " (" + anime.progress + "/" + eps + ")";
}

export function formatMediaEpisodes(anime: Media) {
    let eps: any;
  
    if (
      anime.episodes === null ||
      anime.status === MediaStatus.Releasing
    ) {
      eps = "?";
    } else {
      eps = anime.episodes;
    }
    
    return eps;
  }