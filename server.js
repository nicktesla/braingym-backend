const cors = require('cors');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/get_multiplication_tip', async (req, res) => {
  const { num1, num2 } = req.body;
  console.log(`What is a quick mental math tip for multiplying ${num1} and ${num2}?`)

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `What is a quick mental math tip for multiplying ${num1} and ${num2}?`,
        max_tokens: 500,
        n: 1,
        stop: null,
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GPT3_API_KEY}`,
        },
      }
    );

    const tip = response.data.choices[0].text.trim();
    res.json({ tip });
  } catch (error) {
    console.error('Error fetching multiplication tip:', error);
    res.status(500).json({ error: 'Failed to fetch multiplication tip.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
