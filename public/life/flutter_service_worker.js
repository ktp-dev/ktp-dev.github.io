'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "9a3a17521108369cb0bcd9041321bb7d",
"version.json": "35688b90b7980482388cd00167617e66",
"index.html": "2ebfa62a43137fceea7433e5a687b0de",
"/": "2ebfa62a43137fceea7433e5a687b0de",
"firebase-messaging-sw.js": "e86b215b9e8c0b76fa8daab0755e7c34",
"main.dart.js": "04d6a00d1a6f0df08aa461e815bc0808",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "5a254677f50b96eb02e963785977d681",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "4e6a6c18cbc2cef35f76ac7705f234e3",
"assets/NOTICES": "56730a775a0051815dc9a5533d26b457",
"assets/FontManifest.json": "402b0060c90b366c6afe019e97192b80",
"assets/AssetManifest.bin.json": "8514a6981c00d277c6781f2da8d53ffe",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/flutter_map/lib/assets/flutter_map_logo.png": "208d63cc917af9713fc9572bd5c09362",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "624a268edbb932391906f179362e08dd",
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
"assets/fonts/MaterialIcons-Regular.otf": "e59e653fea941fdbc53872ada72bd84c",
"assets/fonts/SourceSans3-ExtraBold.ttf": "f0c824c74353b6b2202bd4387a7455d1",
"assets/fonts/SF-Pro-Display-BlackItalic.otf": "886bf89d0be0ca7e311d8c5f73f22e88",
"assets/fonts/SF-Pro-Display-Black.otf": "dbb1a2c3c1c56f043b4288f3e5082b02",
"assets/fonts/Montserrat-Black.otf": "7c44b75654ac14a016cdb9a6be2469bb",
"assets/fonts/SF-Pro-Display-BoldItalic.otf": "ffe20e3b2296c1b18b6abefdf7c3eed5",
"assets/assets/images/LinkedinIcon.png": "9d42391daecb952cdffaad185d9aae4b",
"assets/assets/images/pledge_classes/chi2.jpg": "3cc2a7c9847d426cc61a3f8957331c01",
"assets/assets/images/pledge_classes/alphaDelta.jpg": "1522d99adead0ea6be017c5247df8971",
"assets/assets/images/pledge_classes/ae_eboard.JPEG": "1f55299cc331a7f1355b97ba054cc82f",
"assets/assets/images/pledge_classes/omega.jpg": "54a91cc56886084dff1be8c0957bc75b",
"assets/assets/images/pledge_classes/alphaBeta.jpg": "f5ef96a6a7075d1375264f4d86c3ef4a",
"assets/assets/images/pledge_classes/alphaEpsilon.jpeg": "f667d6ab0e2912ba3d162936827778fc",
"assets/assets/images/pledge_classes/alphaGamma.jpeg": "c4d361ab81f4d74434f7f4d59da7e113",
"assets/assets/images/pledge_classes/psi.JPG": "aa3fef16751b1c6089014f4102d864b1",
"assets/assets/images/pledge_classes/chi.jpg": "c0f2a009d4c38c75aa0b9929db1aee83",
"assets/assets/images/gradient.jpg": "4d24c3fc49126ede2136e9f2f04da832",
"assets/assets/images/driveIcon.png": "bd03725b6d75741ee25506be3fd857a8",
"assets/assets/images/lineageTree.JPEG": "7f26919e031d9e6e69d3a3fb8592f4ac",
"assets/assets/images/app_icon.jpg": "91e4e4ecd20bd1a66337eeacd333a99e",
"assets/assets/images/chapters/osu.png": "ae10ce485f918940083d85fa13226a14",
"assets/assets/images/chapters/vanderbilt.png": "6039c353d9e8a3bda61278bfba4bfc21",
"assets/assets/images/chapters/newjersey.png": "87caf86b110dbb09162b32c888a35694",
"assets/assets/images/chapters/utd.png": "376c3d7621f1d6d48a9f40d7f92ae70e",
"assets/assets/images/chapters/lewis.png": "d01af657fdf2156b703d42c67a0ed82c",
"assets/assets/images/chapters/cameron.png": "fa41c0681744356f68fe3147018a9bd2",
"assets/assets/images/chapters/umich.png": "ded9f379e5af8920ff4a52e5f4e2181f",
"assets/assets/images/chapters/umiami.png": "d3894b306a1a0f36b21e708508688f2c",
"assets/assets/images/chapters/chicago.png": "fa565cdecbc7eb8eaaf572411ea7b285",
"assets/assets/images/chapters/northwestern.png": "495250fc40ef1b1119b43599ed08302d",
"assets/assets/images/chapters/usc.png": "4f04647ec19ef8abda1d0c0fdb7d2261",
"assets/assets/images/chapters/cornell.png": "ab529d3d69ba85cdb5fb764e6b71d673",
"assets/assets/images/chapters/pitt.png": "39947a80b2c41fade0da936c001c8b37",
"assets/assets/images/chapters/boston.png": "691615dd04543f71ce38cc9b621a2d17",
"assets/assets/images/chapters/indiana.png": "ad5c49a77b081b6db3e0d91853cf7301",
"assets/assets/images/chapters/syracuse.png": "37e3b4cdbb5471f76c1b0300e8c70a50",
"assets/assets/images/chapters/centralarkansas.png": "9aad1ebd65e2a0b3159edcc6da4920a8",
"assets/assets/images/chapters/virginiatech.png": "986064845c650b94cd97b411a722c1e5",
"assets/assets/images/chapters/vcu.png": "7d089dec04ce65daa351b3074fe45fbe",
"assets/assets/images/chapters/southcarolina.png": "5ea4d87514fba3e6325a00e9a5668f43",
"assets/assets/images/chapters/novasoutheastern.png": "2aa34d0a221f52d1b5b3e4122410ec2d",
"assets/assets/images/chapters/maryland.png": "e8c46cc795320189eedf7ae983618a9b",
"assets/assets/images/chapters/rutgers.png": "61a1f08464f7844e35a66ca2e0aabc76",
"assets/assets/images/chapters/ugeorgia.png": "f766a6985323d163cd598dfbcfc16186",
"assets/assets/images/chapters/unc.png": "6787412e179322dbe01d9cae0c4bc70c",
"assets/assets/images/chapters/uva.png": "5d2c9de31c821de4ad25f988164578da",
"assets/assets/images/chapters/rose-hulman.png": "1b00dde76d62b0f45a019f618f033732",
"assets/assets/images/chapters/cu-boulder.png": "835feca62539876dc118e41497c555fa",
"assets/assets/images/chapters/northeastern.png": "eb60e2a5141dfe90c0c2ca5c97385fac",
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
"assets/assets/images/knowledgeBase.png": "d3eed873e310ef3b4e7bd071c40ceb95",
"assets/assets/images/bday_confetti2.jpg": "e3d227c62cb48b07aee565a4846247ef",
"assets/assets/images/city_icons/seattle.jpg": "c8d2fbf8a143acb70781743f90be1edd",
"assets/assets/images/city_icons/new_york.jpg": "9475e985246769896c99b86ad9200719",
"assets/assets/images/city_icons/washington.jpg": "9039f5dc0ad9e0ceffe5b2abe2e5bc32",
"assets/assets/images/city_icons/ann_arbor.jpg": "44ba9e38cde53114e22cf58129ac14b7",
"assets/assets/images/city_icons/columbus.jpg": "fe811e812fbdd7586c0c0dce46eb925c",
"assets/assets/images/city_icons/chicago.jpg": "49d5647692e6e15bab34899aa96b0ae4",
"assets/assets/images/city_icons/los_angeles.jpg": "f29ee4b3b8c714968a542df05929b0ba",
"assets/assets/images/city_icons/atlanta.jpg": "3b17f831dbb121c1c6583fcc836c74a6",
"assets/assets/images/city_icons/boston.jpg": "f9ed90e11347145e339db9f1684a5504",
"assets/assets/images/city_icons/newark.jpg": "0e048df11a30282dbd497814e4c78dea",
"assets/assets/images/city_icons/pittsburgh.jpg": "5ed570559073b784823695090e8d3549",
"assets/assets/images/city_icons/san_francisco.jpg": "9818098f8a0c60ff6a1233d3004801ed",
"assets/assets/images/city_icons/philadelphia.jpg": "ae087c56e89db3312c198fbd363cd095",
"assets/assets/images/city_icons/miami.jpg": "51db33d347d8f9ea0ee0de0a5e51904a",
"assets/assets/images/city_icons/default.jpg": "a3ed6e59cda9cd6bee13408aed083912",
"assets/assets/images/diwali.JPEG": "4aaef781e7bb63773a953b67662dcb39",
"assets/assets/images/alumni_map.jpg": "7c4602173c0efa50332c6f8a15710ccc",
"assets/assets/images/Twitter_badge.png": "04e8d56db5458a9a352843f55cd560b1",
"assets/assets/images/leaderboard_icons/down.svg": "915cd08df8646a951c37ab79345b83c1",
"assets/assets/images/leaderboard_icons/up.svg": "731a7ba287a70fb72a4fe79e6678fb14",
"assets/assets/images/leaderboard_icons/constant.svg": "45265c1932d769cc1c94ede7ce9b24be",
"assets/assets/images/instagram_logo.svg": "341a67c538d67f9ce92005cf14255dc2",
"assets/assets/images/slack_icon.png": "f642a203b60416d0405b0a4e6cb85a7b",
"assets/assets/images/campus_designs/cube.jpg": "3d4b599f8ac8cd64f05f7b056aa16fec",
"assets/assets/images/campus_designs/hatcher.jpg": "b482465836d4e6b36ae8b8c2a44c21de",
"assets/assets/images/campus_designs/ugli.jpg": "f3491c0b34f8976df465faed7915c8ff",
"assets/assets/images/campus_designs/michigan-theater.jpg": "b4ccd81e8219d24e424877a9ed71c136",
"assets/assets/images/campus_designs/law-quad.jpg": "4ab80d28d06d6711961ba3aac9dc1629",
"assets/assets/images/campus_designs/union.jpg": "a358327aabc7ecb23ce277b05a769478",
"assets/assets/images/wordle-logo.png": "1b69d0cee8419e06be114133cad058fa",
"assets/assets/images/badges/super_pledge_badge.png": "49393b1b700db29c83752e40b83dc866",
"assets/assets/images/badges/ktpalooza_badge.png": "b44109d0376e77768d42a0482c5b652a",
"assets/assets/images/badges/hackathon_badge.png": "b98580e79d668ff10ae8f7ec2ff1ebcb",
"assets/assets/images/badges/committee_goer_badge.png": "44a6c1526aa08374a272402cf27cb184",
"assets/assets/images/badges/study_abroad_badge.png": "c268cd95a9559d72c61332e2c6e321c3",
"assets/assets/images/badges/responsible_monitor_badge.png": "9da6203d11ae06cc497739331239b9b0",
"assets/assets/images/badges/committee_lead_badge.png": "2df4b6a820935703ed7ccf06f8fb6c88",
"assets/assets/images/badges/ktp_nationals_badge.png": "12708c9d3c9d94c85ae8f3bdae4d103a",
"assets/assets/images/badges/community_service_badge.png": "a51aae56c3dcf2471b55ee34c29c992a",
"assets/assets/images/badges/director_badge.png": "7a6a49837adb308e5403de97c46c49e0",
"assets/assets/images/badges/lightning_talk_badge.png": "0086c9c1738ce1a5d8ddec013a760519",
"assets/assets/images/badges/pm_badge.png": "c9f921bb0343653b7ba89efa06c5fdee",
"assets/assets/images/badges/p2p_pm_badge.png": "12369a8d2c2e55aabca23e12e3079eb6",
"assets/assets/images/badges/potential_big_badge.png": "8987fe9fe2ad399e47731aead4ab1d57",
"assets/assets/images/badges/probig_badge.png": "4837ed6533058ba11fcaea959302243f",
"assets/assets/images/badges/ktpalooza_comissioner_badge.png": "61e3870f5908fa84d112f31e8734def8",
"assets/assets/images/badges/big_badge.png": "27adf45a7d78f308a138d8fcea99a872",
"assets/assets/images/badges/150_points_badge.png": "45411b699fbb8d36bc08032be099e3b2",
"assets/assets/images/badges/design_badge.png": "0e4ceb7391c65df92add54cadc98386e",
"assets/assets/images/badges/filler_badge.png": "9d5537105c1930da60130382bcb177c7",
"assets/assets/images/badges/dev_badge.png": "2b9b7725a921899b52b30a03d3b2397d",
"assets/assets/images/badges/eboarder_badge.png": "46c8f02bd41b1e48a3e2e8763323c7f9",
"assets/assets/images/badges/merch_badge.png": "cd83ea1c17135a84fbb9aad008adadc2",
"assets/assets/images/badges/snipes_badge.png": "0c29fab5d7b6e32a832b9bb070acefbc",
"assets/assets/images/ktp_alpha_white.png": "38d45520491cf6cdc76cb5cff4c7773f",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
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
