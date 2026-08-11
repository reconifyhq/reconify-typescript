export interface CursorPage {
  next_cursor?: string;
}

export async function* iterateCursorPages<Item, Page extends CursorPage>(
  fetchPage: (after?: string) => Promise<Page>,
  getItems: (page: Page) => readonly Item[] | null | undefined,
): AsyncGenerator<Item> {
  let after: string | undefined;
  while (true) {
    const page = await fetchPage(after);
    for (const item of getItems(page) ?? []) yield item;
    if (!page.next_cursor || page.next_cursor === after) return;
    after = page.next_cursor;
  }
}
