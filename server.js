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

app.get('/bible/:book/:chapter', (req, res) => {
  let data = [];
  const book = req.params.book;
  const chap = req.params.chapter;
  base('Bible').select({
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
  
      records.forEach(function(record) {
        if (record.fields.Book == book && record.fields.Chapter == chap) {
          data.push(record);
        }
      });
  
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
  
  }, function done(err) {
      if (err) { console.error(err); return; }
      res.send(data)
  });
})

app.listen(port, () => console.log(`Listening on ${port}`))
