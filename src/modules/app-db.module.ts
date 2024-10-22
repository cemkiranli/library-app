import { Db, MongoClient } from 'mongodb';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const host = 'mongodb://localhost:27017';
          const db = 'LibraryService';
          const url = new URL(host);
          const client = await MongoClient.connect(url.href);
          return client.db(db);
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['MONGO_DATABASE_CONNECTION'],
})
export class AppDbModule {}
