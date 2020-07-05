/*
 * Copyright (c) 2016-2020 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import {
  ArticleDocument,
  SearchResult,
  SectionDocument
} from "integrations/search"
import { h, truncate } from "utilities"

/* ----------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/**
 * CSS classes
 */
const css = {
  item:    "md-search-result__item",
  link:    "md-search-result__link",
  article: "md-search-result__article md-search-result__article--document",
  section: "md-search-result__article",
  title:   "md-search-result__title",
  teaser:  "md-search-result__teaser"
}

/* ------------------------------------------------------------------------- */

/**
 * Path of `content-copy` icon
 */
const path =
  "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H13C12.59,21.75 12.2,21.44 " +
  "11.86,21.1C11.53,20.77 11.25,20.4 11,20H6V4H13V9H18V10.18C18.71,10.34 " +
  "19.39,10.61 20,11V8L14,2M20.31,18.9C21.64,16.79 21,14 " +
  "18.91,12.68C16.8,11.35 14,12 12.69,14.08C11.35,16.19 12,18.97 " +
  "14.09,20.3C15.55,21.23 17.41,21.23 " +
  "18.88,20.32L22,23.39L23.39,22L20.31,18.9M16.5,19A2.5,2.5 0 0,1 " +
  "14,16.5A2.5,2.5 0 0,1 16.5,14A2.5,2.5 0 0,1 19,16.5A2.5,2.5 0 0,1 16.5,19Z"

/* ----------------------------------------------------------------------------
 * Helper function
 * ------------------------------------------------------------------------- */

/**
 * Render an article document
 *
 * @param document - Article document
 * @param teaser - Whether to render the teaser
 *
 * @return Element
 */
function renderArticleDocument(
  document: ArticleDocument, teaser: boolean
) {

  /* Render icon */
  const icon = (
    <div class="md-search-result__icon md-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d={path}></path>
      </svg>
    </div>
  )

  /* Render article */
  const { location, title, text } = document
  return (
    <a href={location} class={css.link} tabIndex={-1}>
      <article class={css.article}>
        {icon}
        <h1 class={css.title}>{title}</h1>
        {text.length > 0 && teaser &&
          <p class={css.teaser}>{truncate(text, 320)}</p>
        }
      </article>
    </a>
  )
}

/**
 * Render a section document
 *
 * @param document - Section document
 *
 * @return Element
 */
function renderSectionDocument(
  document: SectionDocument
) {
  const { location, title, text } = document
  return (
    <a href={location} class={css.link} tabIndex={-1}>
      <article class={css.section}>
        <h1 class={css.title}>{title}</h1>
        {text.length > 0 &&
          <p class={css.teaser}>{truncate(text, 320)}
        </p>}
      </article>
    </a>
  )
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Render a search result
 *
 * @param result - Search result
 *
 * @return Element
 */
export function renderSearchResult(
  result: SearchResult, threshold: number = Infinity
) {

  const copy = [...result]


  const found = copy.findIndex(x => !("parent" in x))
  const [article] = copy.splice(found, 1)

  const smaller = Math.max(copy.findIndex(x => x.score < threshold), 0)
  // console.log(threshold, smaller, copy.map(x => x.score))

  const muchRelevant = copy.slice(0, smaller)
  const lessRelevant = copy.slice(smaller)

  const renderButton = (x: number) => <button style="margin-left: 2.2rem; font-size: 1.2em; color: var(--md-accent-fg-color); margin-top: 0.4rem; margin-bottom: 0.8rem;">
    More results on this page ({x})
  </button>

  const children = [
    renderArticleDocument(article as ArticleDocument, !found || smaller === 0),
    ...muchRelevant.map(renderSectionDocument as any),
    renderButton(lessRelevant.length)
    // ...lessRelevant.map(renderSectionDocument as any),
  ]

  /* Render search result */
  return (
    <li class={css.item}>
      {children}
    </li>
  )
}
