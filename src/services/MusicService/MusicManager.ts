import QueueService from "./QueueService.js";
import SpotifyService from "./SpotifyService.js";
import YoutubeService from "./YoutubeService.js";
import AppleService from "./AppleService.js";

export default class MusicManager {

    constructor() {
        const queueService: QueueService = new QueueService();
        const spotifyService: SpotifyService = new SpotifyService();
        const youtubeService: YoutubeService = new YoutubeService();
        const appleService: AppleService = new AppleService();
    }

    getSpotifyLink(link: string) {
        
    }

    getYoutubeLink(link: string) {

    }

    getAppleMusicLink(link: string) {

    }

    identifyMusicLink(link: string): string {
        try {
            const url: URL = new URL(link);
            const host = url.hostname.toLowerCase();

            if (host === "open.spotify.com" || host.endsWith(".spotify.com")) {
                return "spotify";

            } else if (host === "www.youtube.com" || host === "youtu.be" || host.endsWith(".youtube.com")) {
                return "youtube";

            } else if (host === "music.apple.com") {
                return "apple";
            }
            return "unknown";
        } catch {
            return "invalid";
        }
    }

    getMusicFromLink(link: string) {

        const provider = this.identifyMusicLink(link)

        if (provider === "unknown" || provider === "invalid") {return undefined;}

        if (provider === "spotify") {
            this.getSpotifyLink(link);
        } else if (provider === "youtube") {
            this.getYoutubeLink(link);
        } else if (provider === "apple") {
            this.getAppleMusicLink(link);
        }
    }

}