import { NextApiRequest, NextApiResponse } from "next";
import { ArticleRepository } from "../../../lib/repositories/article-repository";

const repo = new ArticleRepository();

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(await repo.getArticles());
};
