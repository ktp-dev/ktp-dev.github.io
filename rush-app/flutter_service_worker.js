'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "f620aa2514248e95a5574cc81493f4be",
"index.html": "7945472e7304ae8c3ecb55e3188ebce8",
"/": "7945472e7304ae8c3ecb55e3188ebce8",
"main.dart.js": "5365b4388aaf06d0bc56b6978b4c57cb",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"favicon.png": "5a254677f50b96eb02e963785977d681",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "6c6849c9889a4c489f1a76d79578e47d",
"assets/AssetManifest.json": "ee1dcc82a424495fed72e43b5f3d853b",
"assets/NOTICES": "d376ad9dcbee3505c22cce69b693f833",
"assets/FontManifest.json": "030723877f187d025e5c91e3b9227ac7",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_AMS-Regular.ttf": "657a5353a553777e270827bd1630e467",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Script-Regular.ttf": "55d2dcd4778875a53ff09320a85a5296",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size3-Regular.ttf": "e87212c26bb86c21eb028aba2ac53ec3",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Typewriter-Regular.ttf": "87f56927f1ba726ce0591955c8b3b42d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Bold.ttf": "a9c8e437146ef63fcd6fae7cf65ca859",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Bold.ttf": "ad0a28f28f736cf4c121bcb0e719b88a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Bold.ttf": "9eef86c1f9efa78ab93d41a0551948f7",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Regular.ttf": "dede6f2c7dad4402fa205644391b3a94",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Regular.ttf": "5a5766c715ee765aa1398997643f1589",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Italic.ttf": "d89b80e7bdd57d238eeaa80ed9a1013a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-Italic.ttf": "a7732ecb5840a15be39e1eda377bc21d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Italic.ttf": "ac3b1882325add4f148f05db8cafd401",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Bold.ttf": "46b41c4de7a936d099575185a94855c4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size2-Regular.ttf": "959972785387fe35f7d47dbfb0385bc4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Regular.ttf": "b5f967ed9e4933f1c3165a12fe3436df",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size1-Regular.ttf": "1e6a3368d660edc3a2fbbe72edfeaa85",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Regular.ttf": "7ec92adfa4fe03eb8e9bfb60813df1fa",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size4-Regular.ttf": "85554307b465da7eb785fd3ce52ad282",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-BoldItalic.ttf": "e3c361ea8d1c215805439ce0941a1c8d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-BoldItalic.ttf": "946a26954ab7fbd7ea78df07795a6cbc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/math_keyboard/fonts/CustomKeyIcons.ttf": "b0bace3f25c2bd05862680e5ad4c6b54",
"assets/packages/flutter_inappwebview_quill/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview_quill/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/youtube_player_flutter_quill/assets/speedometer.webp": "50448630e948b5b3998ae5a5d112622b",
"assets/fonts/SF-Pro-Display-Bold.otf": "3dc0dbf580bc20030c09d3ad1289e444",
"assets/fonts/SF-Pro-Display-Medium.otf": "274391e19ede3d193f3a88cf223aca57",
"assets/fonts/SF-Pro-Display-Heavy.otf": "cdd118538ba804e031bf978ee38c1566",
"assets/fonts/SF-Pro-Display-MediumItalic.otf": "eb62afedf92bb3b8c82bf9171262c46f",
"assets/fonts/SF-Pro-Display-HeavyItalic.otf": "138ff859d992654f246e28c6eb952d27",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/fonts/SF-Pro-Display-BlackItalic.otf": "886bf89d0be0ca7e311d8c5f73f22e88",
"assets/fonts/SF-Pro-Display-Black.otf": "dbb1a2c3c1c56f043b4288f3e5082b02",
"assets/fonts/SF-Pro-Display-BoldItalic.otf": "ffe20e3b2296c1b18b6abefdf7c3eed5",
"assets/assets/images/LinkedinIcon.png": "9d42391daecb952cdffaad185d9aae4b",
"assets/assets/images/gradient.jpg": "4d24c3fc49126ede2136e9f2f04da832",
"assets/assets/images/app_icon.jpg": "9479078a687021f035e1e9936a2de94c",
"assets/assets/images/frat.jpg": "233f80d66e6a60e56bb51e0ae1d374f6",
"assets/assets/images/app_team/Kristine_McLaughlin.jpeg": "e407ca7c3c45571c2a01f72fbb4c49c1",
"assets/assets/images/app_team/Lily_Medway.jpg": "cd617d383b2d8ccd4f30a210747888ac",
"assets/assets/images/app_team/Kali_Francisco.JPG": "f4994ea9c1871c781d235730467cf5a3",
"assets/assets/images/app_team/Serena_Fan.JPG": "bc41eda73d6a5ba5dba2dc65e603349a",
"assets/assets/images/app_team/Carina_Gordon.JPG": "4fd91466d37b0ff89b8917fa5902a3bb",
"assets/assets/images/app_team/Miles_Vasquez.JPG": "f469efedaefc8ce9f775e1b23301472e",
"assets/assets/images/app_team/Maddy_Jennings.jpeg": "c69ad4d0b596294fa64cf72a67d4fff5",
"assets/assets/images/app_team/Abby_Hart.jpeg": "a0b929f71161bbe6a354661e7f3ab698",
"assets/assets/images/app_team/Flynn_Lyon.jpg": "a9dd520a579bf25ccd0b0acb6f58db11",
"assets/assets/images/app_team/Garmo_Grace.jpeg": "3030fc6b039d920f6ef6bbf4cf284090",
"assets/assets/images/app_team/Navya_Yagalla.jpeg": "88012112ac330577f23cd2ee3f86f741",
"assets/assets/images/app_team/Cindy_Liu.jpg": "0860c569b91f5c448a5ae12150d2747d",
"assets/assets/images/app_team/Sujay_Mehta.jpeg": "05be59fd02eea6ee2f5f9f0b583684a0",
"assets/assets/images/app_team/Nate_Bennett.JPG": "e82585e824c9dbf5c1fbe895b9295f24",
"assets/assets/images/app_team/Kelly_Zhang.JPG": "73587431a469dd596b2177652af38e7b",
"assets/assets/images/app_team/Neev_Lamba.jpeg": "56a24402cd3442e07d93a0e06742fa94",
"assets/assets/images/app_team/Zoe_Banks.jpeg": "b18aba1105c29f7572e0aa38860720bf",
"assets/assets/images/app_team/Iris_Funaioli.jpg": "a37a1b04e4c894926a160937ee8a5c5e",
"assets/assets/images/app_team/Anika_Akali.jpeg": "0c7c1b91583858bb18fcd47652ff5793",
"assets/assets/images/app_team/Faye_Stover.jpeg": "7742f55a359ba68f46fb9dca2c131a18",
"assets/assets/images/app_team/Areeb_Khan.jpeg": "c2565d5a6daacda4f6ada14f34703873",
"assets/assets/images/app_team/Lucas_Felpi.jpg": "642d484595ca14b6ae6eae1d8c72f292",
"assets/assets/images/app_team/Himari_Tamura.jpeg": "3a884659fcd10ff9e19b576a89056cf7",
"assets/assets/images/app_team/Abbie_Tooman.jpg": "0e6c05dbeaf69fe7dcb8297c44dfc8f5",
"assets/assets/images/app_team/Frankie_Delmolino.jpeg": "5fa86306feaf0fea1cafbcfac14f6ce9",
"assets/assets/images/app_team/Ananya_Joshi.jpg": "81845088174105f54866da099d3270ca",
"assets/assets/images/app_team/Emma_Rigg.jpeg": "c48155f48a6eb6c4977ac910c7daab13",
"assets/assets/images/app_team/Andrea_Lesmes.jpeg": "c320ebb8578df0e6642b37186bf91c8f",
"assets/assets/images/app_team/Tommy_Joppich.jpeg": "8577f9f5535892de8f232aa7b80f410e",
"assets/assets/images/ktp_alpha.png": "d1584d435380cd342025534e59ab5a8f",
"assets/assets/images/Twitter_badge.png": "04e8d56db5458a9a352843f55cd560b1",
"assets/assets/images/design_badge.png": "9d1a641958b97ae63ba4032172a5386b",
"assets/assets/images/externalpage.png": "e8a6953ba28c42611f2794ba5db3302a",
"assets/assets/images/dev_badge.png": "81bb6efa2f442739bbb87e05342d9221",
"assets/assets/images/chi.jpg": "c0f2a009d4c38c75aa0b9929db1aee83",
"assets/assets/images/ktp_alpha_white.png": "161cc422e50766fe3fdba483bdce679f",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
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
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
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
