import Album from 'Album/Album';
import ModelBase from 'App/ModelBase';

export interface Image {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface Statistics {
  albumCount: number;
  trackCount: number;
  trackFileCount: number;
  percentOfTracks: number;
  sizeOnDisk: number;
  totalTrackCount: number;
}

export interface Ratings {
  votes: number;
  value: number;
}

interface Artist extends ModelBase {
  added: string;
  foreignArtistId: string;
  cleanName: string;
  // ended: boolean;
  // firstAired: Date;
  genres: string[];
  images: Image[];
  // imdbId: string;
  monitored: boolean;
  // network: string;
  // originalLanguage: Language;
  overview: string;
  path: string;
  // previousAiring: Date;
  qualityProfileId: number;
  metadataProfileId: number;
  ratings: Ratings;
  // rootFolderPath: string;
  // runtime: number;
  // seasonFolder: boolean;
  albums: Album[];
  // seriesType: string;
  sortName: string;
  statistics: Statistics;
  status: string;
  tags: number[];
  artistName: string;
  // titleSlug: string;
  // tvdbId: number;
  // tvMazeId: number;
  // tvRageId: number;
  // useSceneNumbering: boolean;
  // year: number;
  artistType?: string;
  lastAlbum?: Album;
  nextAlbum?: Album;
  isSaving?: boolean;
}

export default Artist;
