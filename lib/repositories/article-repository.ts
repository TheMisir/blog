import fs from "fs/promises";
import path, { basename } from "path";
import { Article } from "../interfaces/article";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

export class ArticleRepository {
  private readonly contentDirectory: string;

  constructor() {
    this.contentDirectory = path.join(process.cwd(), "content");
  }

  private async parseArticle(
    fileName: string,
    options: { html: boolean }
  ): Promise<Article> {
    const contents = await fs.readFile(
      path.join(this.contentDirectory, fileName),
      "utf-8"
    );

    const matterResult = matter(contents);
    const { title, image, tags }: { [key: string]: string } = matterResult.data;

    let contentHtml = "";

    if (options.html) {
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      contentHtml = processedContent.toString();
    }

    return {
      id: path.basename(fileName).replace(".md", ""),
      title,
      image,
      tags: tags.split(",").map((s) => s.trim()),
      content: matterResult.content,
      contentHtml,
    };
  }

  async getArticle(name: string): Promise<Article> {
    if (/^[A-Za-z0-9\-_]+$/.test(name)) {
      return this.parseArticle(name + ".md", {
        html: true,
      });
    } else {
      return null;
    }
  }

  async getArticles(): Promise<Article[]> {
    const files = await fs.readdir(this.contentDirectory);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    return Promise.all(
      mdFiles.map((f) => this.parseArticle(path.basename(f), { html: false }))
    );
  }
}
