import remark from 'remark'
import html from 'remark-html'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)
        /*
            {
                id: 'ssg-ssr',
                title: 'When to Use Static Generation v.s. Server-side Rendering',
                date: '2020-01-02'
            }
        */
        // console.log({id, ...matterResult.data})

        // Combine the data with the id
        /*
            matterResultはこんな感じのデータ構造になっている。
            {
                content: '\n' +
                    'Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.\n' +
                    '\n' +
                    '- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.\n' +
                    '- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.\n' +
                    '\n' +
                    'Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.',
                data: { title: 'Two Forms of Pre-rendering', date: '2020-01-01' },
                isEmpty: false,
                excerpt: ''
            }
        */
        // ...は配列・オブジェクトを展開してくれる。
        /*
            スプレッド構文を使用することで下記のようにいい感じにしてくれる。
            {
                id: 'ssg-ssr',
                title: 'When to Use Static Generation v.s. Server-side Rendering',
                date: '2020-01-02'
            }

        */
        return {
            id,
            ...matterResult.data
        }
    })

    // Sort psts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post maetadata section
    const matterResult = matter(fileContents)

    //Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}