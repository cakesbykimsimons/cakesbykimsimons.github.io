import { slug } from "github-slugger";
import { marked } from "marked";

marked.use({
  mangle: false,
  headerIds: false,
});

// slugify
export const slugify = (content: string) => {
  return slug(content);
};

// markdownify
export const markdownify = (content: string, div?: boolean) => {
  return div ? marked.parse(content) : marked.parseInline(content);
};

// Replace fractions like 1/4 with HTML fraction slash
export const replaceFractions = (content: string) => {
  return content.replace(/(\d+)\/(\d+)/g, "$1\u2044$2");
};

// hyphen to space, uppercase only first letter in each word
export const upperHumanize = (content: string) => {
  return content
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase());
};

// hyphen to space, lowercase all letters
export const lowerHumanize = (content: string) => {
  return content.toLowerCase().replace(/-/g, " ");
};

// plainify
export const plainify = (content: string) => {
  const parseMarkdown = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
export const htmlEntityDecoder = (htmlWithEntities: string | undefined | null) => {
  if (!htmlWithEntities) return htmlWithEntities;
  let entityList: { [key: string]: string } = {
    "&nbsp;": "\u00A0",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&hellip;": "\u2026",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&laquo;": "\u00AB",
    "&raquo;": "\u00BB",
    "&prime;": "\u2032",
    "&Prime;": "\u2033",
    "&bull;": "\u2022",
    "&trade;": "\u2122",
    "&copy;": "\u00A9",
    "&reg;": "\u00AE",
    "&frac12;": "\u00BD",
    "&frac14;": "\u00BC",
    "&frac34;": "\u00BE",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /&[a-zA-Z]+;|&#\d+;/g,
    (entity: string): string => {
      return entityList[entity] || entity;
    },
  );
  return htmlWithoutEntities;
};
