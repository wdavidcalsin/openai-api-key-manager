import { Client } from '@notionhq/client';
import express, { type Request, type Response } from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import type { IRows } from './types';

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

const queryDatabase = async (databaseId: string, idApiKey: string): Promise<any> => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'id',
        title: {
          contains: idApiKey,
        },
      },
    });

    return response.results[0].id;
  } catch (err) {
    console.log(err);
    return err;
  }
};

app.get('/api/notion/get-openai-api-key', (req: Request, res: Response) => {
  void (async () => {
    if (NOTION_API_KEY === '' || NOTION_DB_ID === '') {
      throw new Error('Missing notion NOTION_API_KEY or NOTION_DB_ID');
    }

    const query = await notion.databases.query({
      database_id: NOTION_DB_ID ?? '',
    });

    const rows = query.results.map(restItem => restItem) as IRows[];

    const rowStructured = rows.map(({ properties }) => ({
      id: properties?.id.title[0].text.content,
      value: properties?.value.rich_text[0].text.content,
    }));

    try {
      for (const structured of rowStructured) {
        const openaiApiKeyIsValid = await testOpenAiApiKey(structured.value);

        if (openaiApiKeyIsValid) {
          res.status(200).send(structured);
          return;
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong.');
    }
  })();
});

app.get('/api/notion/update-openai-api-key', (req: Request, res: Response) => {
  void (async () => {
    if (NOTION_API_KEY === '' || NOTION_DB_ID === '') {
      throw new Error('Missing notion NOTION_API_KEY or NOTION_DB_ID');
    }

    const { id } = req.query as { id: string };

    const idPage = await queryDatabase(NOTION_DB_ID ?? '', id);

    await notion.pages.update({
      page_id: idPage,
      properties: {
        status: {
          type: 'rich_text',
          rich_text: [
            {
              text: {
                content: 'false',
              },
            },
          ],
        },
      },
    });

    res.status(200).send({ status: 'complete', query: id, idPage });
  })();
});

export default app;
