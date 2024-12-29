import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class BookFormComponent implements OnInit, OnDestroy {
  bookForm: FormGroup;
  isEditing = false;
  editingBookId?: number;
  private editSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      publicationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.editSubscription = this.bookService.getEditBookObservable()
      .subscribe(book => {
        this.isEditing = true;
        this.editingBookId = book.id;
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publicationDate: book.publicationDate
        });
      });
  }

  ngOnDestroy(): void {
    this.editSubscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const book: Book = this.bookForm.value;
      
      if (this.isEditing && this.editingBookId) {
        this.bookService.updateBook(this.editingBookId, book).subscribe({
          next: () => {
            this.resetForm();
            // Emit an event to refresh the book list
            this.bookService.refreshBooks();
          },
          error: (error) => console.error('Error updating book:', error)
        });
      } else {
        this.bookService.addBook(book).subscribe({
          next: () => {
            this.resetForm();
            // Emit an event to refresh the book list
            this.bookService.refreshBooks();
          },
          error: (error) => console.error('Error adding book:', error)
        });
      }
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingBookId = undefined;
    this.bookForm.reset();
  }
} 