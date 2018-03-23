const express = require('express')
const airtable = require('airtable')
const app = express()
const port = process.env.PORT || 3000
const airtable_base = process.env.AIRTABLE_BASE;

airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(airtable_base);

app.use(express.static("static"))

// get all unique categories
app.get('/categories', (req, res) => {
  let unique = [];
  base('Bible')
    .select({view: "Grid view"})
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records
        .forEach(function (record) {
          var categories = record.fields.Categories;
          for(let i = 0; i < categories.length; i += 1) {
            unique.includes(categories[i]) ?
              '' : unique.push(categories[i])
          }
        });
    
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      res.send(unique)
    });
})

// get a specific chapter from a book
app.get('/bible/:book/:chapter', (req, res) => {
  let data = [];
  const book = req.params.book;
  const chap = req.params.chapter;
  base('Bible')
    .select({view: "Grid view"})
    .eachPage(function page(records, fetchNextPage) {
      records
        .forEach(function (record) {
          if (record.fields.Book == book && record.fields.Chapter == chap) {
            data.push(record);
          }
        });
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      res.send(data)
    });
})

// get a random chapter based on a category
app.get('/random/:category', (req, res) => {
  let data = [];
  const category = req.params.category;
  base('Bible')
    .select({view: "Grid view"})
    .eachPage(function page(records, fetchNextPage) {
      records
        .forEach(function (record) {
          var categories = record.fields.Categories;
          for (let i = 0; i < categories.length; i += 1) {
            categories[i] == category
              ? data.push(record)
              : ""
          }
        });
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      const number = Math.floor(Math.random() * Math.floor(data.length))
      res.send(data[number])
    });
})

app.listen(port, () => console.log(`Listening on ${port}`))
