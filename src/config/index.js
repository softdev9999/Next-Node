import devConfig from "./config.dev";
import testConfig from "./config.test";
import prodConfig from "./config.prod";
import betaConfig from "./config.beta";
const configs = {
    dev: devConfig,
    test: testConfig,
    prod: prodConfig,
    beta: betaConfig
};
const config = configs[process.env.NEXT_PUBLIC_STAGE];
config.VERSION = require("../../package.json").version;
config.OG = {
    DESCRIPTION: "Watch shows and movies synced together and hang out over video chat",
    TITLE: "Scener – Watch Netflix and more with friends",
    IMAGE: "https://scener-web.s3-us-west-2.amazonaws.com/og-image-laptop.jpg",
    URL: "https://scener.com"
};
config.CHROMESTORE_URL = "https://chrome.google.com/webstore/detail/scener/" + config.EXTENSION_ID;

/* SERVICE LIST OBJECT explanation

ORDER of this list is respected when rendering, so put them in the order they should appear in the various pickers
------------------------------------------------------------------------------------------------------------------

name - display name / friendly name of this service

host - this match is used to reverse lookup that the URL corresponds to a certain service.

permissionList - permission match string list (url patterns) for the extension that is used for this service. only specify if
permissions are required (not provided by ext)

start - the starting URL that we take the user to when selecting the option, OR when restarting. It should ideally be a base URL,
and a landing page such as the service's homescreen.

countryStart - a set of start overrides per country. These only take effect if a matching country is detected from the list.
It is important that a pathCompareFilter is set if using this setting, as well as a startConverter

promptStart - This service has multiple versions, usually for contract reasons (HBO now vs go, Showtime anytime vs standard)
and we need to prompt each user before nagivgating to the one they have. Hostnames between these will be considered the same,
and thus its important that these sites are nearly identical otherwise. (video IDs, etc) - each domain still needs to be listed
in the permissionList so that permissions can be gathered properly. We will store the result in user settings based on the names.
It is important that a startConverter is used with this setting. Note: not currently compatible with countryStart

startConverter - Converts all host URL sections that match to the start URL of the local guest. We will always use the converted
URL if possible (countryStart or promptStart) This ensures that each audience member is syncing while still using their preferred locale / site.
use this when the starting URLs differ in their paths and represent a baseURL for the whole service. Otherwise, use hostConverter.

hostConverter - like the above but only replaces the hostname in the conversions, instead of the whole start URL/path. Use this if all URLs
across site versions are identical except for the host names.

statusName - name as it will appear in the status bar

navRestrict - In Private rooms (and everywhere in 4.0) the audience would follow all the various pages the host would navigate
during the pre-watch process. This restricts the navigation that the audience will be "taken to" or "taken from", such as account pages and areas of the site
that aren't relevant to watching and require the users attention. In Public theaters, we only show playback pages, otherwise the audience will see the waiting page.

More on the above, navRestrict is still useful for certain error suppression, as error detection can be delayed by a full 1000ms, which can cause the dreaded
"login loop" while the client catches up to its own player state. Since navRestrict applies to both the host and guest, it works best when used as a BLACKLIST,
rather than a whitelist, as the user can navigate accidentally somewhere and will be "trapped" as they are outside of the whitelist
whitelists work better with the navRestrictHost option (see below)

navRestrictHost - similar to the above, but only applies to the host's page state.
This is best used to allow areas that the host may want to visit (their account) but we don't want to route guests there.

navRestrictGuest - similar to the above, but only applies to the guest's page state.
This is best used to hold guests on certain pages until they are completed.

urlParams - on most services, the playback URL is distinct just from the path name. When syncing URLs, we try to crop as much of the extra from
the end when comparing them, which can be different per user in some cases and cause false positives. Setting this to true will include URL
parameters for comparison.

urlHash - similar to the above, includes the hash as part of the URL for checks

adFreeOnly - mark true if this service only syncs properly on ad-free / premium accounts. We display an error for these otherwise

minVersion - minimum extension version needed for this service to function properly. We will ask the user to upgrade when choosing this service if needed

countryRestrict - when set, we will only show this service to hosts if the IPtoloc matches the user's country. They can still use the service via the CustomURL option,
or if they are a guest and the host chooses it.

pathCompareFilter - filters out these matches when comparing URLs paths for syncing (ie - we will consider them the same and not route).
helpful when users get different URLs depending on their locale

overlay: enable the service page overlay

logoPermission: whether we have permission to use the logo on the main site. If set to false, we will only show the logo
in the theatre areas and not in the main site

syncLive: whether to try to sync live content (content with isLive = true) on this service. When false, we will not check currentTime offsets. Set this to true
if the service's live stream is not seekable, or if it always keeps people at the most current point.

pressPlayRequired: This service has a user interface that requires a manual play click before the "player" is loaded (such as an overlay). Thus,
for these services we display a special message to encourage the user to take action.

adStrategy: When the host recieves ads, this is the strategy taken (pauseAll is default):

  * pauseAll: pauses the audience unless we detect they are also receieving an ad at the time of the pause (default strat)
  * continue: don't pause the audience. They will re-sync with the host when the ad is finished. This is the best strategy to use when ad breaks are the same for everyone
  * waitForAd: don't pause the audience until we detect that they have also finished their next ad. This is the best strategy when ad breaks occur at different times
  * pauseIfAdFree: hybrid strategy of the above. pause the video only if the audience has no ad markers in their timeline. Best strat for service with mixed tiers

syncBufferOffset: in milliseconds. some services don't take kindly to aggressive seeking and need more time to finish before trying again. Services that use DRM, Dash Player,
or embedded players will likely need this setting.

episodeParser: formats (series, episode, title) used for parsing series and episode number from the raw subtitle. Each service has a slightly different format

promptLogin: after choosing the service for the first time, We ask the user to login externally if they haven't already. This attribute can be applied to the whole
setting, or within the promptStart item setting

hideBrowsing: [default false] when true, do not route to host's non-watch pages as they browse around a service site. This is always true for public rooms.

hideBrowsing: [default false] when true, do not route to host's non-watch pages as they browse around a service site. This is always true for public rooms.

trackingParams: Add url paramters here that will be added to all URLs routed for this service. The params won't be included in routing decisions, however.
Some special placeholders that can be used are: {ROOMID} {ROOMTYPE} which will get replaced with their actual values. Leave out the starting &/? as this will be
added automatically depending on the contents of the URL

*/


config.SERVICE_LIST = {
    scener: {
        host: /(scener\.com|localhost)/gi,
        navRestrict: /^(?:(?!\/permissions|\/camera).)+$/gi,
    },
    netflix: {
        name: "Netflix",
        host: /.*?netflix\.com/gi,
        navRestrict: /^(?:(?!\/login|\/signup|\/registration).)+$/gi,
        navRestrictHost: /^(?:(?!\/(my-list|referfriends|profiles|YourAccount)).)+$/gi,
        start: "https://netflix.com",
        statusName: "NETFLIX",
        logoPermission: true,
        overlay: false,
        episodeParser: {
          series: /[SP]([0-9]+):/i,
          episode: /(E|Episode )([0-9]+)/i,
          title: /[SP][0-9]+:[E][0-9]+\s?(.+?)$/i
        }
    },
    disney: {
        name: "Disney+",
        host: /.*?disneyplus\.com/gi,
        permissionList: ["*://*.disneyplus.com/*"],
        navRestrict: /^(?:(?!\/login|\/sign-up|\/forgot-password).)+$/gi,
        navRestrictHost: /^(?:(?!\/(edit-profiles|select-profile|account)).)+$/gi,
        start: "https://disneyplus.com",
        statusName: "DISNEY+",
        countryRestrict: ["United States", "Canada", "New Zealand", "Australia", "Netherlands", "Puerto Rico",
        "Austria", "Germany", "Ireland", "Italy", "France", "Spain", "Switzerland", "United Kingdom"],
        pathCompareFilter: /^\/([a-zA-Z]{2}-[a-zA-Z]+)/gi,
        logoPermission: true,
        overlay: false,
        episodeParser: {
          series: /[SP]([0-9]+):/i,
          episode: /[E]([0-9]+)\s?/i,
          title: /[E][0-9]+\s?(.+?)$/i
        }
    },
    hotstar: {
        name: "Hotstar",
        host: /.*?hotstar\.com/gi,
        permissionList: ["*://*.hotstar.com/*"],
        start: "https://hotstar.com",
        statusName: "HOTSTAR",
        countryStart: {
          "United States": "https://hotstar.com/us",
          "United Kingdom": "https://hotstar.com/gb",
          "Canada": "https://hotstar.com/ca",
          "India": "https://hotstar.com/in",
          "Indonesia": "https://hotstar.com/id"
        },
        countryRestrict: ["United States", "Canada", "United Kingdom", "India", "Indonesia"],
        startConverter: /^https:\/\/hotstar\.com\/([a-zA-Z]{2})/gi,
        pathCompareFilter: /^\/([a-zA-Z]{2})/gi,
        minVersion: "5.0.0",
        logoPermission: true,
        overlay: false,
        episodeParser: {
          series: /[SP]([0-9]+)/i,
          episode: /[E]([0-9]+)/i,
          title: /[E][0-9]+\s?(.+?)$/i
        }
    },
    hulu: {
        name: "Hulu",
        host: /.*?hulu\.com/gi,
        permissionList: ["*://*.hulu.com/*"],
        navRestrictHost: /^(?:(?!\/(my-stuff|account)).)+$/gi,
        start: "https://hulu.com",
        statusName: "HULU",
        countryRestrict: ["United States"],
        adFreeOnly: true,
        logoPermission: true,
        overlay: false,
        episodeParser: {
          series: /[SP]([0-9]+)\s/i,
          episode: /[E]([0-9]+)/i,
          title: /[e][0-9]+\s(.+?)$/i
        }
    },
    prime: {
        //TODO: preroll duration of clips causes duration mismatch
        /*
          a hostConverter for prime isn't supported yet, as prime has
          different videoIDs per locale (UGH)

          hostConverter: /(www\.)?amazon(\.[a-z]+)?\.[a-z]+/i,
        */
        name: "Prime Video",
        host: /.*?amazon(\.[a-z]+)?\.[a-z]+/gi,
        permissionList: ["*://*.amazon.com/*", "*://*.amazon.co.uk/*"],
        navRestrict: /^(?:(?!\/(signin|register)).)+$/gi,
        navRestrictHost: /\/(?:storefront|detail|Amazon-Video)/gi,
        start: "https://www.amazon.com/gp/video/storefront",
        statusName: "PRIME VIDEO",
        countryRestrict: ["United States", "United Kingdom"],
        countryStart: {
          "United States": "https://www.amazon.com/gp/video/storefront",
          "United Kingdom": "https://www.amazon.co.uk/gp/video/storefront",
        },
        overlay: false,
        logoPermission: true,
        pressPlayRequired: false,
        episodeParser: {
          series: /Sn ([0-9]+)\s?/i,
          episode: /Ep ([0-9]+)\s?/i,
          title: /Ep [0-9]+\s?(.+?)$/i
        }
    },
    hbo: {
        name: "HBO",
        host: /play\.hbo(?:go|now|max)\.com/gi,
        permissionList: ["*://*.hbomax.com/*"],
        navRestrictHost: /^(?:(?!\/(profileSelect)).)+$/gi,
        start: "https://play.hbomax.com",
        statusName: "HBO",
        countryRestrict: ["United States"],
        promptLogin: "https://play.hbomax.com/login",
        overlay: false,
        logoPermission: false,
        pressPlayRequired: true,
        episodeParser: {
          series: /Sn ([0-9]+)\s/i,
          episode: /Ep ([0-9]+)\s?/i,
          title: /Ep [0-9]+\s?(.+?)$/i
        }
    },
    youtube: {
        name: "YouTube",
        host: /.*?youtube\.com/gi,
        permissionList: ["*://*.youtube.com/*", "*://*.youtube.tv/*"],
        navRestrict: /\/(?:embed|watch|results|feed|channel|gaming)/gi,
        navRestrictHost: /^(?:(?!\/feed\/(my_videos|purchases|library|subscriptions|history)).)+$/gi,
        start: "https://youtube.com",
        statusName: "YOUTUBE",
        urlParams: true,
        overlay: false,
        logoPermission: true,
        extLogin: true,
        syncLive: true, // may consider setting this to false
        episodeParser: false
    },
    funimation: {
        name: "Funimation",
        host: /.*?funimation\.com/gi,
        permissionList: ["*://*.funimation.com/*"],
        navRestrict: /^(?:(?!\/log-in|\/subscribe|\/confirmation|\/account|\/checkout).)+$/gi,
        start: "https://funimation.com",
        statusName: "FUNIMATION",
        urlParams: false,
        adFreeOnly: true,
        overlay: false,
        logoPermission: true,
        syncBufferOffset: 500,
        episodeParser: {
          series: /Season ([0-9]+)\s?/i,
          episode: /Episode ([0-9]+)\s?/i,
          title: /(Episode ([0-9]+)\s)?(.+?)$/i
        }
    },
    showtime: {
        name: "Showtime",
        host: /.*?showtime(anytime)?\.com/gi,
        permissionList: ["*://*.showtime.com/*", "*://*.showtimeanytime.com/*"],
        navRestrict: /^(?:(?!#getstarted|#signin|#login|\/signup|\/redeem).)+$/gi,
        start: "https://showtime.com",
        promptStart: {
          "showtime" : {
            title: "Showtime",
            description: "For subscribers who signed up through the SHOWTIME website or the SHOWTIME app.",
            start: "https://showtime.com"
          },
          "showtimeanytime" : {
            title: "Showtime Anytime",
            description: "For subscribers who signed up through a cable, satellite, telco or streaming service provider.",
            start: "https://showtimeanytime.com",
            promptLogin: "https://www.showtimeanytime.com"
          }
        },
        hostConverter: /(www\.)?showtime(anytime)?\.com/gi,
        syncLive: false,
        statusName: "SHOWTIME",
        countryRestrict: ["United States"],
        overlay: false,
        urlHash: true,
        minVersion: "5.1.105",
        logoPermission: true,
        episodeParser: {
          series: /Season ([0-9]+) /i,
          episode: /Ep ([0-9]+):/i,
          title: /: (.+?)$/i
        },
        hideBrowsing: true,
        trackingParams: "p_cid={ROOMTYPE}-{ROOMID}"
    },
    crunchyroll: {
        name: "Crunchyroll",
        host: /.*?crunchyroll\.com/gi,
        permissionList: ["*://*.crunchyroll.com/*"],
        navRestrict: /^(?:(?!\/login|\/resetpw).)+$/gi,
        start: "https://crunchyroll.com/videos/anime",
        statusName: "CRUNCHYROLL",
        adFreeOnly: true,
        overlay: false,
        logoPermission: false,
        episodeParser: {
          series: /Episode ([0-9]+)\s? - (.+?)$/i,
          episode: /Episode ([0-9]+)\s? - (.+?)$/i,
          title: /Episode ([0-9]+)\s? - (.+?)$/i
        }
    },
    vimeo: {
        name: "Vimeo",
        host: /.*?vimeo\.com/gi,
        permissionList: ["*://*.vimeo.com/*"],
        navRestrict: /^(?:(?!\/sign_up|\/upgrade|\/log_in).)+$/gi,
        navRestrictHost: /^(?:(?!\/manage).)+$/gi,
        start: "https://vimeo.com/watch",
        statusName: "VIMEO",
        overlay: false,
        logoPermission: true,
        episodeParser: false
    },
    alamo: {
        name: "Alamo",
        host: /.*?ondemand\.drafthouse\.com/gi,
        permissionList: ["*://*.drafthouse.com/*"],
        navRestrict: /^(?:(?!\/signin|\/signup|\/forgotpassword|player_missing_from_library).)+$/gi,
        navRestrictHost: /^(?:(?!(wishlist\.html|library\.html|devices\.html|account\.html)).)+$/gi,
        start: "https://ondemand.drafthouse.com",
        statusName: "ALAMO",
        urlParams: true,
        urlHash: true,
        minVersion: "5.0.0",
        overlay: false,
        logoPermission: true,
        syncBufferOffset: 1000,
        episodeParser: false
    },
    pluto: {
        name: "Pluto TV",
        host: /.*?pluto\.tv/gi,
        permissionList: ["*://*.pluto.tv/*"],
        start: "https://pluto.tv/live-tv",
        syncLive: false,
        statusName: "PLUTO TV",
        overlay: false,
        logoPermission: true,
        episodeParser: {
          series: /S([0-9]+)/i,
          episode: /E([0-9]+)/i,
          title: /S[0-9]+E[0-9]+ (.+?)$/i
        }
    },
    peacock: {
        name: "Peacock TV",
        host: /.*?peacocktv\.com/gi,
        permissionList: ["*://*.peacocktv.com/*"],
        navRestrict: /^(?:(?!\/signin|\/freesignup|\/plans|\/cox|\/xfinity).)+$/gi,
        start: "https://peacocktv.com/watch/home",
        syncLive: false,
        statusName: "PEACOCK",
        pauseGuestsOnAds: false,
        overlay: false,
        minVersion: "5.1.108",
        logoPermission: true,
        episodeParser: {
          series: /S([0-9]+)/i,
          episode: /E([0-9]+)/i,
          title: /: (.+?)$/i
        }
    },
    shudder: {
        name: "Shudder",
        host: /.*?shudder\.com/gi,
        permissionList: ["*://*.shudder.com/*"],
        navRestrict: /^(?:(?!\/login|\/provider|\/signup|\/cox|\/xfinity).)+$/gi,
        start: "https://www.shudder.com",
        statusName: "SHUDDER",
        overlay: false,
        minVersion: "5.1.109",
        logoPermission: true,
        syncLive: false,
        episodeParser: {
          series: false,
          episode: /([0-9]+)\./i,
          title: /\. (.+?)$/i
        }
    }
};

config.getServiceStart = (service, country, setting, roomData) => {

  if (service && config.SERVICE_LIST[service] && config.SERVICE_LIST[service].start) {

    let startUrl = config.SERVICE_LIST[service].start;

    if (country && config.SERVICE_LIST[service].countryStart && config.SERVICE_LIST[service].countryStart[country]) {
      startUrl = config.SERVICE_LIST[service].countryStart[country];
    }

    if (setting && config.SERVICE_LIST[service].promptStart && config.SERVICE_LIST[service].promptStart[setting]) {
      //console.log('*** SERVICE START **', config.SERVICE_LIST[service].promptStart[setting].start);

      startUrl = config.SERVICE_LIST[service].promptStart[setting].start;
    }

    return config.addTrackingParams(startUrl, service, roomData);
  }
};

config.addTrackingParams = (url, serv, roomData) => {

  let retType = "url";
  let urlData = url;

  if (typeof url === "string") {
    urlData = new URL(url);
    retType = "string";
  }

  //console.log("*** ROOM DATA ***", roomData);

  if (serv && config.SERVICE_LIST[serv].trackingParams) {

    let trackingString = config.SERVICE_LIST[serv].trackingParams;

    // dont add the params if they are already there
    let trackingMatch = new RegExp(trackingString.replaceAll(/{[a-zA-Z]+}/g, "[a-zA-Z0-9]+"));

    if (!urlData.href.match(trackingMatch)) {
      if (roomData && roomData.id) {
        trackingString = trackingString.replace("{ROOMID}", roomData.id);
      }
      if (roomData && roomData.id) {
        trackingString = trackingString.replace("{ROOMTYPE}", roomData.type);
      }

      urlData.href = urlData.href + (urlData.search ? "&" : "?") + trackingString;
    }

  }

  return retType == "string" ? urlData.href : urlData;
};

config.getStartUrl = () => {

  if (window && window.location) {
    return "https://" + window.location.host + "/c/";
  } else {
    return config.CONTENT_START_URL;
  }
};

config.getSidebarUrl = (roomId, contentId) => {

  if (window && window.location) {
    return "https://" + window.location.host + "/live/" + roomId + (contentId ? "?contentId=" + contentId : "");
  } else {
    return config.SIDEBAR_URL + "/" + roomId + (contentId ? "?contentId=" + contentId : "");
  }
};

export default config;
