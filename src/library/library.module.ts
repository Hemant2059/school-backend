import { Module } from '@nestjs/common';
import { LibraryBookController } from './controllers/library-book.controller.js';
import { BookIssueController } from './controllers/book-issue.controller.js';
import { LibraryBookService } from './services/library-book.service.js';
import { BookIssueService } from './services/book-issue.service.js';

@Module({
  controllers: [LibraryBookController, BookIssueController],
  providers: [LibraryBookService, BookIssueService],
  exports: [LibraryBookService, BookIssueService],
})
export class LibraryModule {}