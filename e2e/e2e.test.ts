import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import puppeteer from 'puppeteer'
import type { Browser, Page } from 'puppeteer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('e2e', () => {
  let browser: Browser
  let page: Page
  const baseUrl = `file:///${path.resolve(__dirname, './index.html')}`

  test('canvas', async () => {
    expect(await page.$('canvas')).toBeTruthy()
  })

  test('title and text', async () => {
    const title = await page.title()
    expect(title).toBe('Truth-cli - truth of npm')

    await page.waitForSelector('.left')
    const logo = await page.$eval('.left', el => el.textContent)
    expect(logo?.trim()).toBe('TRUTH-CLI')

    const iconBtn = await page.$$eval('.el-button', (items) => {
      return items.map(item => item?.getAttribute('title'))
    })
    expect(iconBtn.filter(item => item?.trim())).toEqual(['下载图片', '命中/还原节点'])
    const btn = await page.$$eval('.el-button > span', (items) => {
      return items.map(item => item?.textContent?.trim())
    })
    expect(btn).toEqual(['收缩节点', '打开信息框', '切换图表'])
  })

  test('drawer', async () => {
    expect(await page.$('.drawer')).toBeFalsy()
    await page.$$eval('.el-button > span', (items) => {
      items.map(async (item) => {
        if (item.innerHTML.trim() === '打开信息框') {
          item.click()
          expect(item.innerHTML).toBe('关闭信息框')
        }
      })
    })
    expect(await page.$('.drawer')).toBeTruthy()
    const info = await page.$eval('.drawer', el => el.textContent)
    expect(info?.includes('依赖信息')).toBeTruthy()
    expect(info?.includes('name')).toBeTruthy()
    expect(info?.includes('version')).toBeTruthy()
    await page.locator('.drawer button').click()
    const infoList = await page.$$eval('.el-popper li', (items) => {
      return items.map(item => item.textContent?.trim())
    })
    expect(infoList).toEqual([
      '依赖信息',
      '循环依赖',
      '版本引用',
      '其他版本',
      'NPM',
    ])
  })

  test('input', async () => {
    expect(await page.$('.el-input')).toBeTruthy()
    expect(await page.$('.el-input__inner')).toBeTruthy()
    await page.$$eval('.el-button > span', (items) => {
      items.map(async (item) => {
        if (item.innerHTML.trim() === '打开信息框')
          item.click()
      })
    })
    await page.locator('input').fill('hello world!')
    const pkgName = await page.$eval('.pkgName', el =>
      el?.textContent?.includes('hello world!'),
    )
    expect(pkgName).toBeTruthy()
  })

  beforeAll(async () => {
    browser = await puppeteer.launch()
  })

  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto(baseUrl)
  })

  afterEach(async () => {
    await page.close()
  })

  afterAll(async () => {
    await browser.close()
  })
})
