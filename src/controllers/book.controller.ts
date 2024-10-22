import { Controller, Get, Post, Param, Body, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { LibraryModel } from '../models/library.model';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Create a new book
  @Post()
  async createBook(@Body() book: LibraryModel): Promise<LibraryModel> {
    try {
      return await this.bookService.createBook(book);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get all books
  @Get()
  async getAllBooks(): Promise<LibraryModel[]> {
    return await this.bookService.getAllBooks();
  }

  // Get a book by id
  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<LibraryModel> {
    try {
      return await this.bookService.getBookById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid ID format');
    }
  }

  // Update a book by id
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() updateData: Partial<LibraryModel>): Promise<LibraryModel> {
    try {
      return await this.bookService.updateBook(id, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid ID format');
    }
  }

  // Delete a book by id
  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    try {
      await this.bookService.deleteBook(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid ID format');
    }
  }
}
