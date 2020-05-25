const fetch = require("node-fetch");
const Game = require('../models/Game')

const consumer = {
  updateGames: async () => {
    try {
      let games = await Promise.all([
        fetch("https://api1.origin.com/xsearch/store/en_us/mex/products?searchTerm=free&sort=rank%20desc%2CreleaseDate%20desc%2Ctitle%20desc&start=0&rows=20&isGDP=true", {
          "credentials": "omit",
          "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
            "Accept": "application/json",
            "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
          },
          "referrer": "https://www.origin.com/mex/en-us/search?searchString=free",
          "method": "GET",
          "mode": "cors"
        })
          .then(games => games.json())
          .then(games => games.games.game
            .filter(game => !game.gameName.includes('free') && !game.gameName.includes('Free'))
            .map(game => originToGame(game))
          ),
        fetch("https://www.epicgames.com/store/backend/graphql-proxy", {
          "credentials": "include",
          "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
          },
          "referrer": "https://www.epicgames.com/store/es-ES/browse?pageSize=30&q=free&sortBy=relevance&sortDir=DESC",
          "body": "{\"query\":\"query searchStoreQuery($allowCountries: String, $category: String, $count: Int, $country: String!, $keywords: String, $locale: String, $namespace: String, $itemNs: String, $sortBy: String, $sortDir: String, $start: Int, $tag: String, $releaseDate: String, $withPrice: Boolean = false, $withPromotions: Boolean = false) {\\n  Catalog {\\n    searchStore(allowCountries: $allowCountries, category: $category, count: $count, country: $country, keywords: $keywords, locale: $locale, namespace: $namespace, itemNs: $itemNs, sortBy: $sortBy, sortDir: $sortDir, releaseDate: $releaseDate, start: $start, tag: $tag) {\\n      elements {\\n        title\\n        id\\n        namespace\\n        description\\n        effectiveDate\\n        keyImages {\\n          type\\n          url\\n        }\\n        seller {\\n          id\\n          name\\n        }\\n        productSlug\\n        urlSlug\\n        url\\n        items {\\n          id\\n          namespace\\n        }\\n        customAttributes {\\n          key\\n          value\\n        }\\n        categories {\\n          path\\n        }\\n        price(country: $country) @include(if: $withPrice) {\\n          totalPrice {\\n            discountPrice\\n            originalPrice\\n            voucherDiscount\\n            discount\\n            currencyCode\\n            currencyInfo {\\n              decimals\\n            }\\n            fmtPrice(locale: $locale) {\\n              originalPrice\\n              discountPrice\\n              intermediatePrice\\n            }\\n          }\\n          lineOffers {\\n            appliedRules {\\n              id\\n              endDate\\n              discountSetting {\\n                discountType\\n              }\\n            }\\n          }\\n        }\\n        promotions(category: $category) @include(if: $withPromotions) {\\n          promotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n          upcomingPromotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n        }\\n      }\\n      paging {\\n        count\\n        total\\n      }\\n    }\\n  }\\n}\\n\",\"variables\":{\"category\":\"games/edition/base|bundles/games|editors\",\"count\":30,\"country\":\"AR\",\"keywords\":\"free\",\"locale\":\"es-ES\",\"sortDir\":\"DESC\",\"allowCountries\":\"AR\",\"start\":0,\"tag\":\"\",\"withPrice\":true}}",
          "method": "POST",
          "mode": "cors"
        })
          .then(games => games.json())
          .then(games => games.data.Catalog.searchStore.elements.map(game => epicToGame(game))),
        getAllGOGGames(),
        getAllJoltGames()
      ]).then(games => games.flat());

      const dbGames = await Game.find();
      let created = 0, updated = 0, errors = 0;
      games.forEach(game => {
        const existingGame = dbGames.find((dbGame) =>
          dbGame.website === game.website &&
          dbGame.websiteId === game.websiteId
        );
        if (existingGame) {
          Game.updateOne({ "_id": existingGame._id }, game,
            (err, doc) => { if (err) errors++ })
          updated++
        } else {
          Game.create(game);
          created++
        }
      });
      console.log("Updating Games Database: Created %d Updated %d Errors %d", created, updated, errors)
    } catch (err) {
      console.log(err);
    }
  }
}

const getAllGOGGames = async () => {
  let pages = 1;
  const result = []
  for (let i = 1; i <= pages; i++) {
    const gogGames = await fetch('https://www.gog.com/games/ajax/filtered?mediaType=game&page=' + i + '&price=free&sort=popularity')
      .then(games => games.json())
      .then(games => {
        pages = games.totalPages
        return games.products.map(game => gogToGame(game))
      });
    result.push(...gogGames);
  }
  return result;
}


const formatGogImage = (image) => image.replace(/images-[0-9]/, 'images') + '.jpg'

const gogToGame = (game) => {
  return {
    publisher: game.publisher,
    image: formatGogImage(game.image),
    title: game.title,
    category: game.category,
    url: 'https://gog.com' + game.url,
    website: 'gog.com',
    websiteId: '' + game.id
  }
}
// hacer que todos busquen screenshots?
const epicToGame = (game) => {
  return {
    publisher: game.seller.name,
    image: game.keyImages[4].url,
    title: game.title,
    category: null,
    url: 'https://epicgames.com/store/product/' + game.productSlug,
    website: 'epicgames.com',
    websiteId: '' + game.id
  }
}

const originToGame = (game) => {
  return {
    publisher: 'Origin',
    image: game.image,
    title: game.gameName,
    category: null,
    url: 'https://www.origin.com/store' + game.path,
    website: 'origin.com',
    websiteId: game.gameName
  }
}

const gameJoltToGame = (game) => {
  return {
    publisher: game.developer.name,
    image: game.img_thumbnail,
    title: game.title,
    category: null,
    url: 'https://gamejolt.com/games/' + game.path + '/' + game.id,
    website: 'gamejolt.com',
    websiteId: '' + game.id
  }
}

const getAllJoltGames = async () => {
  let pages = 1;
  const result = []
  for (let i = 1; i <= pages; i++) {
    const joltGames = await fetch("https://gamejolt.com/site-api/web/discover/games?section=featured&page=" + i + "&f_price=free&f_status[]=complete", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      "referrer": "https://gamejolt.com/games/featured?price=free&status=complete&page=2",
      "method": "GET",
      "mode": "cors"
    })
      .then(games => games.json())
      .then(games => {
        pages = Math.ceil(games.payload.gamesCount / games.payload.perPage);
        return games.payload.games.map(game => gameJoltToGame(game))
      })
    result.push(...joltGames);
  }
  return result;
}

module.exports = consumer;