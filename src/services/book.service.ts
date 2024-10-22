import { Db, ObjectId } from 'mongodb';
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LibraryModel } from '../models/library.model';

@Injectable()
export class BookService {

  constructor(@Inject('MONGO_DATABASE_CONNECTION') private db: Db) {
  }

  async createBook(book: LibraryModel): Promise<LibraryModel> {
    const collection = this.db.collection<LibraryModel>('books');
    const result = await collection.insertOne(book);

    const createdBook = await collection.findOne({ _id: result.insertedId });
    if (!createdBook) {
      throw new NotFoundException('Book already created');
    }
    return createdBook;
  }


  async getAllBooks(): Promise<LibraryModel[]> {
    const collection = this.db.collection<LibraryModel>('books');
    return await collection.find().toArray();
  }

  async getBookById(id: string): Promise<LibraryModel> {
    const collection = this.db.collection<LibraryModel>('books');
    const book = await collection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    
    return book;
  }

  async updateBook(id: string, updateData: Partial<LibraryModel>): Promise<LibraryModel> {
    const collection = this.db.collection<LibraryModel>('books');

    // check objectId is valid
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Book not found');
    }

    return result as LibraryModel;
  }


  async deleteBook(id: string): Promise<void> {
    const collection = this.db.collection<LibraryModel>('books');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Book not found');
    }
  }

}
