import "./styles.css";

const display = document.querySelector("#display");
const displayTitle = document.querySelector("#displayTitle");
const searchInput = document.querySelector("#searchForm");
const searchButton = document.querySelector("#store_search_link");
const categoryGroup = document.querySelector(".categoryGroup");

const getSearch = async () => {
  const search = document.getElementById("searchForm");

  try {
    const userInput = search.value;
    console.log(userInput);
  } catch (err) {
    console.log("err", err);
  }
};

document.getElementById("store_search_link").onclick = async function () {
  const search = document.getElementById("searchForm");
  const inputValue = search.value;
  showAllGames("", "", inputValue);
};
////////////////////////////////////////////////////////////////
const toptoptop = document.getElementById("top");
const getFeaturedGames = async () => {
  try {
    const url = `https://cs-steam-game-api.herokuapp.com/features`;
    const res = await fetch(url);
    toptoptop.innerHTML = "";
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("err", err);
  }
};

const renderFeaturedGames = async () => {
  const res = await getFeaturedGames();
  const FGgames = res.data;
  for (let i = 2; i < FGgames.length; i++) {
    const game = FGgames[i];
    const name = game.name;
    const image = game.header_image;
    const fgtilteHtml = document.createElement("p");
    const fgimageHtml = document.createElement("img");

    fgtilteHtml.textContent = name;
    fgimageHtml.src = image;

    const newDivnew = document.createElement("div");
    newDivnew.appendChild(fgtilteHtml);
    newDivnew.appendChild(fgimageHtml);

    toptoptop.appendChild(newDivnew);
    toptoptop.className = "fg-grid-item";
  }
};
getFeaturedGames();
renderFeaturedGames();
//////////////////////////////////////////////////////////////////////////
const getAllgame = async (genre, tagParam, inputParam) => {
  try {
    let category = ``;
    if (genre) {
      const encode = encodeURIComponent(genre);
      category = `?genres=${encode}`;
    }

    let tag = ``;
    if (tagParam) {
      const encode = encodeURIComponent(tagParam);
      tag = `?steamspy_tags=${encode}`;
    }

    let input = ``;
    if (inputParam) {
      const encode = encodeURIComponent(inputParam);
      input = `?q=${encode}`;
    }

    const url = `https://cs-steam-game-api.herokuapp.com/games${category}${tag}${input}`;

    console.log("tong", url);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
};

const showAllGames = async (genre, tag, input) => {
  document.getElementById("progress").style.display = "block";
  // document.getElementById("display_featuredgame").style.display = "none";
  const res = await getAllgame(genre, tag, input);
  document.getElementById("progress").style.display = "none";
  // document.getElementById("display_featuredgame").style.display = "none";

  const games = res.data;
  display.innerHTML = "";
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    // game
    const name = game.name;
    const image = game.header_image;
    const price = game.price;
    const appid = game.appid;
    // const tag = game.steamspy_tags;

    // html
    const tilteHtml = document.createElement("p");
    const priceHtml = document.createElement("span");
    const imageHtml = document.createElement("img");
    const appidHtml = document.createElement("p");
    // const tagHtml = document.createElement("tag");

    tilteHtml.textContent = name;
    priceHtml.textContent = `${price}$`;
    imageHtml.src = image;
    appidHtml.textContent = `ID:${appid}`;
    // tagHtml.textContent = tag;

    const newDiv = document.createElement("div");
    newDiv.appendChild(tilteHtml);
    newDiv.appendChild(priceHtml);
    // newDiv.appendChild(tagHtml);
    newDiv.appendChild(imageHtml);
    newDiv.appendChild(appidHtml);
    newDiv.className = "grid-item";

    newDiv.onclick = async function () {
      try {
        const url = `https://cs-steam-game-api.herokuapp.com/single-game/${appid}`;
        const res = await fetch(url);
        const data = await res.json();

        console.log(data);
        const img = data.data.header_image;
        const des = data.data.description;
        const rel = data.data.release_date;
        const tag = data.data.steamspy_tags;
        const plf = data.data.platforms;

        display.innerHTML = "";

        const gameDetail = document.createElement("div");
        const imgDetail = document.createElement("img");
        const desDetail = document.createElement("p");
        const relDetail = document.createElement("p");
        const tagDetail = document.createElement("p");
        const plfDetail = document.createElement("p");
        tagDetail.id = "game-tag-detail";
        plfDetail.id = "game-plf-detail";

        const gameTagH3 = document.createElement("h3");
        gameTagH3.textContent = "Tags";
        gameTagH3.style.marginBottom = "32px";
        tagDetail.appendChild(gameTagH3);

        const platformH3 = document.createElement("h3");
        platformH3.textContent = "Platforms";
        platformH3.style.marginBottom = "32px";
        plfDetail.appendChild(platformH3);

        for (let i = 0; i < plf.length; i++) {
          const plfSpan = document.createElement("span");
          plfSpan.textContent = plf[i];
          plfSpan.className = "game-plf";
          plfDetail.appendChild(plfSpan);
        }

        for (let i = 0; i < tag.length; i++) {
          const tagSpan = document.createElement("span");
          tagSpan.textContent = tag[i];
          tagSpan.className = "game-tag";

          tagSpan.onclick = function () {
            showAllGames("", tag[i]);
          };

          tagDetail.appendChild(tagSpan);
        }

        imgDetail.src = img;
        desDetail.textContent = des;
        relDetail.textContent = `Release Date: ${rel}`;

        gameDetail.appendChild(imgDetail);
        gameDetail.appendChild(desDetail);
        gameDetail.appendChild(relDetail);
        gameDetail.appendChild(tagDetail);
        gameDetail.appendChild(plfDetail);
        display.appendChild(gameDetail);

        console.log(img);
        console.log(des);
      } catch (err) {
        console.log("err", err);
      }
    };

    display.appendChild(newDiv);
  }
};

async function run() {
  showAllGames("");
}

const categorySection = async () => {
  try {
    const categories = await getCategories();
    showCategories(categories);
  } catch (err) {
    console.log(err);
  }
};

const getCategories = async () => {
  try {
    const url = `https://cs-steam-game-api.herokuapp.com/genres?limit=100`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
};

const showCategories = (data) => {
  const ul = document.getElementById("categoryGroupbtn");

  const categories = data.data;
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const id = category._id;
    const name = category.name;

    const item = document.createElement("li");
    item.id = id;
    item.textContent = name.toUpperCase();
    item.onclick = function () {
      showAllGames(name);
    };

    ul.appendChild(item);
  }
};

categorySection();

run();
