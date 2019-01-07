// require the express module
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
// add the middleware to parse the body content

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logger = (req, res, next) => {
  console.log(req.method, req.path);
  console.log('====');
  console.log(req.query);
  console.log(req.body);
  console.log('\n');
  next();
}; 
app.use(logger); 

 

const publicPath = path.resolve(__dirname, "public");

// The Deafult Artwork List
const s1 = ` _______________
 |~|_________|~|
 |::::\\^o^/::::|
 ---------------
 |..|/     \\|..|
 ---        ----
 |  |       |  |
 |  |       |  |
 |  |       |  |
.|__|.     .|__|.`;

const s2 = `  ______
  ======
 /      \\
|        |-.
|        |  \\
|O.o:.o8o|_ /
|.o.8o.O.|
 \\.o:o.o/`;

const s3 = ` /\\_/\\
( o.o )
 > ^ <`; 

const tag1 = ["architecture", "public"];
const tag2 = ["snack", "notmybestwork"];
const tag3 = ["pet", "kitty", "cute"];

const artwork1 = {title: "washington sq arch", date: "2018-09-29", artString: s1, tags: tag1};
const artwork2 = {title: "boba", date: "2018-09-30", artString: s2, tags: tag2};
const artwork3 = {title: "cat", date: "2018-10-31", artString:s3, tags: tag3};
const defaultArtworks = [artwork1, artwork2, artwork3];
/*
 * this function returns a reversed array
 */
function reverseArray (arr){
	let i, temp;
	let j = arr.length - 1;
	for(i = 0; i < arr.length / 2; i++){
		temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
		j--;
	}
	return arr;
}

let reversedArtworks = reverseArray(defaultArtworks);
/*
 * return a filtered array of artworks by tag
 */
function filterByTag (filter, arr) {
	const filtered = [];
	arr.forEach(artwork => {
			artwork["tags"].filter(tag => {
				if(tag === filter) {
					filtered.push(artwork);
				}
			});
	});

	return filtered;
}

function addEntry (req) {
	const newEntry = req.body;
	const tagString = newEntry["tags"];
	const tagArr = tagString.split(',');
	newEntry["tags"] = tagArr;
	// add the new entry to the existing artworks
	defaultArtworks.push(newEntry);
	return reverseArray(defaultArtworks);
}

// sets the templating system for our express app (default is pug, but we
// want handlebars)
app.set('view engine', 'hbs');
app.use(express.static(publicPath));


app.get('/', (req, res) => {
	const tag = req.query.tag;
	if(tag !== undefined && tag !== null && tag !== ''){
		const filtered = filterByTag(tag, defaultArtworks);
		res.render('naruto', {'defaultArtworks': [...filtered]});
	}
	else{
		res.render('naruto', {'defaultArtworks': [...reversedArtworks]});
	}
});


app.get('/add', (req, res) => {
	res.render('add', {'defaultArtworks': [...reversedArtworks]});
});


app.post('/add', (req, res) => {
	// add the new entry to our artwork database
	reversedArtworks = addEntry(req);
	res.redirect('/');
});

app.get('/naruto', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.render('naruto', {"artworks": "Picasso, Nara, Gandi"});
}); 
app.listen(3000);