import { ColoringBook } from '../types';

const STORAGE_KEY = 'wondercraft_saved_books_v1';

export function getSavedBooks(): ColoringBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load books from localStorage:', err);
    return [];
  }
}

export function saveBookToStorage(book: ColoringBook): ColoringBook[] {
  try {
    const existing = getSavedBooks();
    const updatedBook = {
      ...book,
      updatedAt: new Date().toISOString(),
    };

    const index = existing.findIndex((b) => b.id === book.id);
    let updatedList: ColoringBook[];

    if (index >= 0) {
      updatedList = [...existing];
      updatedList[index] = updatedBook;
    } else {
      updatedList = [updatedBook, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (err) {
    console.error('Failed to save book to localStorage:', err);
    return getSavedBooks();
  }
}

export function deleteBookFromStorage(bookId: string): ColoringBook[] {
  try {
    const existing = getSavedBooks();
    const filtered = existing.filter((b) => b.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete book from localStorage:', err);
    return getSavedBooks();
  }
}
