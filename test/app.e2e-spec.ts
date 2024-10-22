import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../src/services/book.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';

const mockBook = {
  _id: new ObjectId(),
  title: 'Test Book',
  author: 'testauthor',
  price: 10,
  isbn: '1234567890',
  language: 'English',
  numberOfPage: 100,
  publisher: 'Test Publisher',
};

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  find: jest.fn(),
  toArray: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('BookService', () => {
  let service: BookService;
  let db: Db;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: 'MONGO_DATABASE_CONNECTION', useValue: mockDb },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    db = module.get<Db>('MONGO_DATABASE_CONNECTION');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      mockDb.insertOne.mockResolvedValue({ insertedId: mockBook._id });
      mockDb.findOne.mockResolvedValue(mockBook);

      const result = await service.createBook(mockBook as any
      );

      expect(result).toEqual(mockBook);
      expect(mockDb.insertOne).toHaveBeenCalledWith(mockBook);
      expect(mockDb.findOne).toHaveBeenCalledWith({ _id: mockBook._id });
    });

    it('should throw NotFoundException if book creation fails', async () => {
      mockDb.insertOne.mockResolvedValue({ insertedId: mockBook._id });
      mockDb.findOne.mockResolvedValue(null);

      await expect(service.createBook(mockBook as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      mockDb.find.mockReturnThis();
      mockDb.toArray.mockResolvedValue([mockBook]);

      const result = await service.getAllBooks();

      expect(result).toEqual([mockBook]);
      expect(mockDb.find).toHaveBeenCalled();
    });
  });

  describe('getBookById', () => {
    it('should return the correct book by id', async () => {
      mockDb.findOne.mockResolvedValue(mockBook);

      const result = await service.getBookById(mockBook._id.toString());

      expect(result).toEqual(mockBook);
      expect(mockDb.findOne).toHaveBeenCalledWith({ _id: mockBook._id });
    });

    it('should throw NotFoundException if book is not found', async () => {
      mockDb.findOne.mockResolvedValue(null);

      await expect(service.getBookById(mockBook._id.toString())).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBook', () => {
    it('should update the book successfully', async () => {
      const updateData = { title: 'Updated Title' };
      mockDb.findOneAndUpdate.mockResolvedValue({ value: { ...mockBook, ...updateData } });

      const result = await service.updateBook(mockBook._id.toString(), updateData);

      expect(result).toEqual({ ...mockBook, ...updateData });
      expect(mockDb.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockBook._id },
        { $set: updateData },
        { returnDocument: 'after' },
      );
    });

    it('should throw NotFoundException if book is not found for update', async () => {
      mockDb.findOneAndUpdate.mockResolvedValue({ value: null });

      await expect(
        service.updateBook(mockBook._id.toString(), { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.updateBook('invalid-id', { title: 'New Title' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteBook', () => {
    it('should delete the book successfully', async () => {
      mockDb.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await service.deleteBook(mockBook._id.toString());

      expect(mockDb.deleteOne).toHaveBeenCalledWith({ _id: mockBook._id });
    });

    it('should throw NotFoundException if book is not found for deletion', async () => {
      mockDb.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.deleteBook(mockBook._id.toString())).rejects.toThrow(NotFoundException);
    });
  });
});
