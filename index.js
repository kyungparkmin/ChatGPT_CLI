#!/usr/bin/env node

const { Configuration, OpenAIApi } = require("openai");
const readline = require('readline');
require('dotenv').config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateMessage = async (prompt) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 3500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null,
  });
  return completion.data.choices[0].text;
}

const sendMessage = () => {
  rl.question('질문을 입력하세요 : ', async (prompt) => {
    if (prompt === 'exit') {
      rl.close();
    } else {
      console.log('답변 불러오는 중......')
      const reply = await generateMessage(prompt);
      console.log(reply);
      sendMessage();
    }
  });
}

sendMessage();

rl.on('close', () => {
  console.log('프로그램이 종료되었습니다');
  process.exit(0);
});