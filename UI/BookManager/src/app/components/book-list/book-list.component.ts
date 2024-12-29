import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  displayedColumns: string[] = ['title', 'author', 'isbn', 'publicationDate', 'actions'];
  private refreshSubscription?: Subscription;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.refreshSubscription = this.bookService.getRefreshObservable()
      .subscribe(() => this.loadBooks());
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }

  editBook(book: Book): void {
    this.bookService.editBook(book);
  }
} 