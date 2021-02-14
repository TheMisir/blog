import { NextApiRequest, NextApiResponse } from "next";
import { ArticleRepository } from "../../../lib/repositories/article-repository";

const repo = new ArticleRepository();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const article = await repo.getArticle(req.query.id.toString());

  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};
