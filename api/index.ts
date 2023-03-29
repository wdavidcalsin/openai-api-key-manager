import { Client } from '@notionhq/client';
import express, { type Request, type Response } from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { type IRows } from './types';

dotenv.config();

const app = express();
const { NOTION_API_KEY, NOTION_DB_ID } = process.env;
const notion = new Client({ auth: NOTION_API_KEY });

const testOpenAiApiKey = async (openaiApiKey: string): Promise<boolean> => {
  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Show api keys randoms:\n\n',
    });

    console.log(`API KEY ${openaiApiKey} is valid. ${res.status}`);

    return true;
  } catch (err) {
    console.log(`API KEY ${openaiApiKey} not valid.`);
    return false;
  }
};

app.get('/api/notion/openai-api-key', (req: Request, res: Response) => {
  // if (NOTION_API_KEY === '' || NOTION_DB_ID === '') {
  //   throw new Error('Missing notion NOTION_API_KEY or NOTION_DB_ID');
  // }
  // const query = await notion.databases.query({
  //   database_id: NOTION_DB_ID ?? '',
  // });
  // const rows = query.results.map(restItem => restItem) as IRows[];
  // const rowStructured = rows.map(({ properties }) => ({
  //   id: properties?.id.title[0].text.content,
  //   value: properties?.value.rich_text[0].text.content,
  // }));
  // try {
  //   for (const structured in rowStructured) {
  //     const openaiApiKeyIsValid = await testOpenAiApiKey(structured);
  //     if (openaiApiKeyIsValid) {
  //       res.status(200).send(structured);
  //     }
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send('Something went wrong.');
  // }
});

export default app;
