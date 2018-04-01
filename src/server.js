const express = require('express');
const airtable = require('airtable');
const app = express();
const port = process.env.PORT || 3000;
const airtable_base = process.env.AIRTABLE_BASE;
const base = airtable.base(airtable_base);

app.use(express.static('dist'));

airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});

// TODO: move to helpers
function getRandom(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// get a random entry
app.get('/random', (req, res) => {
  let entries = [];
  base('Bible').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
         entries.push(record);
      });
      fetchNextPage();
    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      let n = getRandom(1, entries.length);
      res.send(entries[n]);
    });
});

// get a specific chapter by ID
app.get('/id/:id', (req, res) => {
  const id = req.params.id;
  let entry = [];
  base('Bible').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
        id == record.fields.Id ? entry.push(record) : ''
      });
      fetchNextPage();
    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      res.send(entry)
    });
});

// get a specific chapter from a book
app.get('/bible/:book/:chapter', (req, res) => {
  let entry = [];
  let book = req.params.book;
  let chap = req.params.chapter;
  base('Bible').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      if (record.fields.Book == book && record.fields.Chapter == chap) {
        entry.push(record);
      }
    });
    fetchNextPage();
  }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      res.send(entry)
    }
  );
})

// get all unique categories
app.get('/categories', (req, res) => {
  let unique = [];
  base('Bible').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      let categories = record.fields.Categories;
      for(let i = 0; i < categories.length; i += 1) {
        unique.includes(categories[i]) ? '' : unique.push(categories[i])
      }
    });
    fetchNextPage();
  }, function done(err) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(unique)
    }
  );
})

// get a random chapter based on book
app.get('/book/:book', (req, res) => {
  let entries = [];
  let book = req.params.book;
  base('Bible').select({view: "Grid view"})
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
        if (record.fields.Book == book) {
          entries.push(record);
        }
      });
      fetchNextPage();
    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      let number = Math.floor(Math.random() * Math.floor(entries.length))
      res.send(entries[number])
    });
});


// get a random chapter based on a category
app.get('/category/:category', (req, res) => {
  let entries = [];
  let category = req.params.category;
  base('Bible').select({view: "Grid view"})
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
        var categories = record.fields.Categories;
        for (let i = 0; i < categories.length; i += 1) {
          categories[i] == category ? entries.push(record) : ""
        }
      });
      fetchNextPage();
    }, function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      let number = Math.floor(Math.random() * Math.floor(entries.length))
      res.send(entries[number])
    });
});

app.listen(port, () => console.log(`Listening on ${port}`))
