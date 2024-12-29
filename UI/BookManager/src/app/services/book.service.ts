import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://localhost:7082/api/books';
  private refreshSubject = new Subject<void>();
  private editBookSubject = new Subject<Book>();

  constructor(private http: HttpClient) { }

  refreshBooks(): void {
    this.refreshSubject.next();
  }

  getRefreshObservable(): Observable<void> {
    return this.refreshSubject.asObservable();
  }

  editBook(book: Book): void {
    this.editBookSubject.next(book);
  }

  getEditBookObservable(): Observable<Book> {
    return this.editBookSubject.asObservable();
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 