const fetch = require("node-fetch");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "scripts")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const mainURL = "https://newsapi.org/v2/top-headlines?pageSize=30&apiKey=8f0aa78b8224416fa8c3790e453c113e&";

const countryList = {
    "ae": "United Arab Emirates",
    "ar": "Argentina",
    "at": "Austria",
    "au": "Australia",
    "be": "Belgium",
    "bg": "Bulgaria",
    "br": "Brazil",
    "ca": "Canada",
    "ch": "Switzerland",
    "cn": "China",
    "co": "Colombia",
    "cu": "Cuba",
    "cz": "Czechia",
    "de": "Germany",
    "eg": "Egypt",
    "fr": "France",
    "gb": "United Kingdom",
    "gr": "Greece",
    "hk": "Hong Kong",
    "hu": "Hungary",
    "id": "Indonesia",
    "ie": "Ireland",
    "il": "Israel",
    "in": "India",
    "it": "Italy",
    "jp": "Japan",
    "kr": "South Korea",
    "lt": "Lithuania",
    "lv": "Latvia",
    "ma": "Morocco",
    "mx": "Mexico",
    "my": "Malaysia",
    "ng": "Nigeria",
    "nl": "Netherlands",
    "no": "Norway",
    "nz": "New Zealand",
    "ph": "Philippines",
    "pl": "Poland",
    "pt": "Portugal",
    "ro": "Romania",
    "rs": "Serbia",
    "ru": "Russia",
    "sa": "Saudi Arabia",
    "se": "Sweden",
    "sg": "Singapore",
    "si": "Slovenia",
    "sk": "Slovakia",
    "th": "Thailand",
    "tr": "Turkey",
    "tw": "Taiwan",
    "ua": "Ukraine",
    "us": "United States",
    "ve": "Venezuela",
    "za": "South Africa"

};



countryCode = Object.keys(countryList);  // 1. Get the country codes
countries = Object.values(countryList); // 2. Get the country names


const countryListReverse = {};
Object.keys(countryList).forEach(key => {
    countryListReverse[countryList[key]] = key;
});

const Categories = ["business", "entertainment", "health", "science", "sports", "technology"];



defaultCountry = "in";

function countryUrl(countryCode) {
    return mainURL + "country=" + countryCode;
}

function categoryUrl(category) {
    return mainURL + "category=" + category + "&country=" + defaultCountry;
}

let defaultCountryName = "India";


let url = countryUrl(defaultCountry);

const getNews = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    let articles = data.articles;
    return articles;
};

app.get("/", async (req, res) => {
    let articles = await getNews(url);
    res.render("index", { articles, countries, countryCode, Categories, defaultCountryName, countryListReverse });
});

app.get("/country", (req, res) => {
    res.render("country", { countries, countryCode, defaultCountryName, countryListReverse });
});

app.get("/country/:country", async (req, res) => {
    let country = req.params.country;
    let url = countryUrl(countryListReverse[country]);
    defaultCountryName = country;
    defaultCountry = countryListReverse[country];
    let articles = await getNews(url);

    res.render("index", { articles, countries, countryCode, Categories, defaultCountryName, countryListReverse });
});

app.get("/categories", (req, res) => {
    res.render("categories", { Categories, defaultCountryName, countryListReverse });
});

app.get("/categories/:category", async (req, res) => {
    let category = req.params.category;
    let categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

    let url = categoryUrl(category);
    let articles = await getNews(url);
    res.render("categoryAll", { articles, categoryCapitalized, category, defaultCountryName, countryListReverse });
});

app.get("/country", (req, res) => {
    res.render("country", { countries, countryCode, defaultCountryName });
});

app.get("/country/:country", async (req, res) => {
    let country = req.params.country;
    let url = countryUrl(countryListReverse[country]);
    let articles = await getNews(url);
    defaultCountryName = country;
    res.render("index", { articles, countries, countryCode, Categories, defaultCountryName, countryListReverse });
});


app.get("/search", (req, res) => {
    let searchText = req.query.q;

    let url = mainURL + "q=" + searchText;
    getNews(url).then(articles => {
        res.render("search", { articles, searchText, defaultCountryName, countryListReverse });
    });
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});