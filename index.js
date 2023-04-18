#!/usr/bin/env node

const { Configuration, OpenAIApi } = require("openai");
const readline = require('readline');
const { program } = require('commander');
require('dotenv').config();

program
  .version('1.0.0')
  .description('A simple ChatGPT CLI program');

program.parse(process.argv);

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
  const message = completion.data.choices[0].text;
  return message;
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


