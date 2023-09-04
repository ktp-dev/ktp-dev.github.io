'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "b6c60882a90e9bb6b502a9273e5b9fa7",
"index.html": "fddf2652feb09cb55c756cc0521ac316",
"/": "fddf2652feb09cb55c756cc0521ac316",
"main.dart.js": "2d7ba80d5f6fce35a9017136d6c6f252",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5a254677f50b96eb02e963785977d681",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "4e6a6c18cbc2cef35f76ac7705f234e3",
"assets/AssetManifest.json": "dfde8f252aa1c51c4076a2b82476a5ee",
"assets/NOTICES": "0a8051ee2d22ef41708cd699e78a617d",
"assets/FontManifest.json": "402b0060c90b366c6afe019e97192b80",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.smcbin": "de714be954696216bcfa017805280724",
"assets/fonts/SourceSans3-Regular.ttf": "04f1a4f0fdf585fc5b56885fefc9e8d2",
"assets/fonts/SF-Pro-Display-Bold.otf": "3dc0dbf580bc20030c09d3ad1289e444",
"assets/fonts/SourceSans3-Black.ttf": "cb41cc6e7fffbba0ce2bb37d1f914c7c",
"assets/fonts/SF-Pro-Display-Medium.otf": "274391e19ede3d193f3a88cf223aca57",
"assets/fonts/SourceSans3-Bold.ttf": "a923b66a888fa07af060554d8c28644b",
"assets/fonts/SF-Pro-Display-Heavy.otf": "cdd118538ba804e031bf978ee38c1566",
"assets/fonts/SF-Pro-Display-MediumItalic.otf": "eb62afedf92bb3b8c82bf9171262c46f",
"assets/fonts/SourceSans3-Medium.ttf": "fda30e61e2b62c05a0e900f055f0ce29",
"assets/fonts/SourceSans3-SemiBold.ttf": "cf5be8398a1f0d84582ce6b3723c031d",
"assets/fonts/SF-Pro-Display-HeavyItalic.otf": "138ff859d992654f246e28c6eb952d27",
"assets/fonts/KarnakPro-CondensedBlack.otf": "e61d78c393beab8e5054b9c806d5e4e7",
"assets/fonts/MaterialIcons-Regular.otf": "ba3fdc22ae6cd75a3c313e13cb590935",
"assets/fonts/SourceSans3-ExtraBold.ttf": "f0c824c74353b6b2202bd4387a7455d1",
"assets/fonts/SF-Pro-Display-BlackItalic.otf": "886bf89d0be0ca7e311d8c5f73f22e88",
"assets/fonts/SF-Pro-Display-Black.otf": "dbb1a2c3c1c56f043b4288f3e5082b02",
"assets/fonts/Montserrat-Black.otf": "7c44b75654ac14a016cdb9a6be2469bb",
"assets/fonts/SF-Pro-Display-BoldItalic.otf": "ffe20e3b2296c1b18b6abefdf7c3eed5",
"assets/assets/images/LinkedinIcon.png": "9d42391daecb952cdffaad185d9aae4b",
"assets/assets/images/gradient.jpg": "4d24c3fc49126ede2136e9f2f04da832",
"assets/assets/images/app_icon.jpg": "91e4e4ecd20bd1a66337eeacd333a99e",
"assets/assets/images/chapters/newjersey.png": "87caf86b110dbb09162b32c888a35694",
"assets/assets/images/chapters/utd.png": "376c3d7621f1d6d48a9f40d7f92ae70e",
"assets/assets/images/chapters/umich.png": "ded9f379e5af8920ff4a52e5f4e2181f",
"assets/assets/images/chapters/chicago.png": "033b0969f7b72b83a5e45980d4dae908",
"assets/assets/images/chapters/northwestern.png": "ee5b402a0999cc858ebcfe6b49ac3d39",
"assets/assets/images/chapters/usc.png": "4f04647ec19ef8abda1d0c0fdb7d2261",
"assets/assets/images/chapters/pitt.png": "39947a80b2c41fade0da936c001c8b37",
"assets/assets/images/chapters/boston.png": "691615dd04543f71ce38cc9b621a2d17",
"assets/assets/images/chapters/syracuse.png": "37e3b4cdbb5471f76c1b0300e8c70a50",
"assets/assets/images/chapters/vcu.png": "7d089dec04ce65daa351b3074fe45fbe",
"assets/assets/images/chapters/maryland.png": "e8c46cc795320189eedf7ae983618a9b",
"assets/assets/images/chapters/unc.png": "6787412e179322dbe01d9cae0c4bc70c",
"assets/assets/images/chapters/rose-hulman.png": "1b00dde76d62b0f45a019f618f033732",
"assets/assets/images/chapters/cu-boulder.png": "835feca62539876dc118e41497c555fa",
"assets/assets/images/beep_white.png": "211de16883943a850883fa423220323d",
"assets/assets/images/frat.jpg": "233f80d66e6a60e56bb51e0ae1d374f6",
"assets/assets/images/bday_shape.jpg": "68c2e4e7c1938cdd8d5b52a3f86d5ad6",
"assets/assets/images/bday_confetti.jpg": "5c7631ce2568e21750731d2a64eee885",
"assets/assets/images/event_covers/ross.jpg": "82610f89d35d33fc34c716c0e70db17c",
"assets/assets/images/event_covers/michigan_union.jpeg": "89611d4bafea6d8df968175ad5b57e02",
"assets/assets/images/event_covers/mason_hall.jpg": "1d707b11a8c5b6a7ce645b871da87cb3",
"assets/assets/images/event_covers/east_quad.jpg": "4b2c70866f84151e75a8b4d213f3d83a",
"assets/assets/images/event_covers/cccb.jpeg": "360dfc67129f2bc77e8f43be82b371ac",
"assets/assets/images/event_covers/north_quad.jpg": "c553a27f53d35cc3758aa0cda4242d49",
"assets/assets/images/event_covers/virtual.jpeg": "822cb6b27cc7ec6a08e653889d7a8863",
"assets/assets/images/event_covers/michigan_league.jpeg": "b74e3ac3d3d4b0ec41b7143e1c2015a6",
"assets/assets/images/gmail.png": "daa9065ff1314879f95cf8235463514d",
"assets/assets/images/ktp_alpha.png": "1b3a464d9968af5f6b02d410a0b4271c",
"assets/assets/images/beep.png": "35d121be04eab41460775c3cf930eac9",
"assets/assets/images/app_icons/smiley.jpg": "9cdc009422d27131d99fddb6b1f0c7e7",
"assets/assets/images/app_icons/retrotech.jpg": "26cac9a136525d2605b1398ffda5ee97",
"assets/assets/images/app_icons/yearbook.jpg": "89b0c4f4498cd33a3cbd07766e803546",
"assets/assets/images/app_icons/blonde.jpg": "01d5283e1908b2693bf13a6e553560d5",
"assets/assets/images/app_icons/yellow.jpg": "348e27b06434e2b4554f7e724e38e513",
"assets/assets/images/app_icons/pokemon.jpg": "1b8caed05bfb18e92e116f531fd0f1bc",
"assets/assets/images/app_icons/crossover.jpg": "2bf3f3ebca626bc4c88f1cc893e2b387",
"assets/assets/images/app_icons/squiggle.jpg": "9c51a4f3c1f42832b7a81d3cb895a9c3",
"assets/assets/images/app_icons/brown.jpg": "cdc527293cfd8220c5112e08724ba8f1",
"assets/assets/images/app_icons/default.jpg": "7dff2608ec4179fd778801f939b6a2ea",
"assets/assets/images/app_icons/sticker.jpg": "213352939befddf27bc562014d9da48f",
"assets/assets/images/app_icons/white.jpg": "c771af4fffe199fa2c24ac434b8ea619",
"assets/assets/images/bday_confetti2.jpg": "e3d227c62cb48b07aee565a4846247ef",
"assets/assets/images/gradient2.jpg": "d5bae5a4b1dc0818654d9db02c0d87c4",
"assets/assets/images/gradient3.jpg": "d4556e7587a26455bb23040ce6bd6f75",
"assets/assets/images/Twitter_badge.png": "04e8d56db5458a9a352843f55cd560b1",
"assets/assets/images/psi.JPG": "aa3fef16751b1c6089014f4102d864b1",
"assets/assets/images/wordle-logo.png": "1b69d0cee8419e06be114133cad058fa",
"assets/assets/images/badges/ktpalooza_badge.png": "a87556fbc12a0d45e470cac6831daf28",
"assets/assets/images/badges/hackathon_badge.png": "d8254108d30bb0455965f43581799bd1",
"assets/assets/images/badges/committee_goer_badge.png": "56788939c79a94b4171f9295b10ccc50",
"assets/assets/images/badges/responsible_monitor_badge.png": "6ca9187e5e77a2cd9ac5787044609e2b",
"assets/assets/images/badges/committee_lead_badge.png": "927795eebdb56d1d75c78e3ee97d507c",
"assets/assets/images/badges/community_service_badge.png": "57acaa9f87d6428d84a9b43b36cd9b7c",
"assets/assets/images/badges/director_badge.png": "8e1cc0e63957e130065d038ef72665d4",
"assets/assets/images/badges/lightning_talk_badge.png": "8dd6f081c48115b3125f88b6daeba9ce",
"assets/assets/images/badges/pm_badge.png": "7727bc82700349aebd89d8b4369ad99a",
"assets/assets/images/badges/probig_badge.png": "54638394eef1024ae7e70716bdb9a588",
"assets/assets/images/badges/ktpalooza_comissioner_badge.png": "a8ca73c21fe76f3a955a793aef447827",
"assets/assets/images/badges/big_badge.png": "defc0dede906f43a2ab4452d8596b444",
"assets/assets/images/badges/150_points_badge.png": "b5f0f88c4a191b1bb32b8828eecf9423",
"assets/assets/images/badges/design_badge.png": "a04de09e1b81a84757fb3c850481b1ba",
"assets/assets/images/badges/filler_badge.png": "9d5537105c1930da60130382bcb177c7",
"assets/assets/images/badges/dev_badge.png": "025593cb60c90e70efc156738a66531b",
"assets/assets/images/badges/eboarder_badge.png": "ff588a5e884545bc177aa0210bcc0a81",
"assets/assets/images/badges/merch_badge.png": "f3b24654f30dee6ede704e6a528785ca",
"assets/assets/images/badges/snipes_badge.png": "8a65cf8e2c15c5650641e9fbc4834f60",
"assets/assets/images/chi.jpg": "c0f2a009d4c38c75aa0b9929db1aee83",
"assets/assets/images/ktp_alpha_white.png": "38d45520491cf6cdc76cb5cff4c7773f",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
