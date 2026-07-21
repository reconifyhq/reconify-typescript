export interface CursorPage {
  nextCursor?: string;
}

export async function* iterateCursorPages<Item, Page extends CursorPage>(
  fetchPage: (after?: string) => Promise<Page>,
  getItems: (page: Page) => readonly Item[] | null | undefined,
): AsyncGenerator<Item> {
  let after: string | undefined;
  while (true) {
    const page = await fetchPage(after);
    for (const item of getItems(page) ?? []) yield item;
    if (!page.nextCursor || page.nextCursor === after) return;
    after = page.nextCursor;
  }
}
