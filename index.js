require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
  res.json({
    message: 'Fruit Info Backend Running'
  });
});

app.get('/favorites', async (req, res) => {
  try{
    const{ data, error } = await supabase
    .from('favorites')
    .select('*');

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.post('/favorites', async (req, res) => {
  try{
    const {fruit_name} = req.body;

    const {data, error} = await supabase
     .from('favorites')
     .insert([
      {
        fruit_name: fruit_name
      }
     ])
     .select();

     if (error) throw error;

     res.status(201).json({
      message: 'Fruit added',
      data: data
     });
    
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get('/fruit/:name', async (req, res) => {
  try{
    const fruitName = req.params.name;
    const response = await fetch(
      `https://fruityvice.com/api/fruit/${fruitName}`
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
