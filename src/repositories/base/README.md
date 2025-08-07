# Base Repository Pattern

This directory contains the base repository implementation that provides common CRUD operations for all repositories in the project.

## Files

- `IBaseRepository.ts` - Interface defining common repository operations
- `BaseRepository.ts` - Abstract base class implementing common CRUD operations
- `index.ts` - Export file for easy importing

## Usage

### 1. Extend BaseRepository in your repository implementation

```typescript
import { BaseRepository } from '../base';
import { User, UserType } from '../../model/user/userModel';

class UserRepositoryImplementation extends BaseRepository<UserType> implements IUserRepository {
    constructor() {
        super(User); // Pass the Mongoose model to the base repository
    }

    // Override base methods if needed
    async createUser(user: UserType): Promise<UserType> {
        return await this.create(user);
    }

    // Add custom methods specific to your repository
    async findActiveUsers(): Promise<UserType[]> {
        return await this.findMany({ status: 1 });
    }
}
```

### 2. Available Base Methods

#### Create Operations
- `create(data: T): Promise<T>` - Create a single document
- `createMany(data: T[]): Promise<T[]>` - Create multiple documents

#### Read Operations
- `findById(id: string): Promise<T | null>` - Find by ID
- `findByEmail(email: string): Promise<T | null>` - Find by email
- `findAll(): Promise<T[]>` - Find all documents
- `findOne(filter: any): Promise<T | null>` - Find one document
- `findMany(filter: any, options?: {...}): Promise<T[]>` - Find many documents with options

#### Update Operations
- `updateById(id: string, data: Partial<T>): Promise<T | null>` - Update by ID
- `updateByEmail(email: string, data: Partial<T>): Promise<T | null>` - Update by email
- `updateOne(filter: any, data: Partial<T>): Promise<T | null>` - Update one document
- `updateMany(filter: any, data: Partial<T>): Promise<number>` - Update many documents

#### Delete Operations
- `deleteById(id: string): Promise<boolean>` - Delete by ID
- `deleteByEmail(email: string): Promise<boolean>` - Delete by email
- `deleteOne(filter: any): Promise<boolean>` - Delete one document
- `deleteMany(filter: any): Promise<number>` - Delete many documents

#### Utility Operations
- `count(filter?: any): Promise<number>` - Count documents
- `exists(filter: any): Promise<boolean>` - Check if document exists
- `aggregate(pipeline: any[]): Promise<any[]>` - Run aggregation pipeline

### 3. Benefits

1. **Code Reusability**: Common CRUD operations are implemented once
2. **Consistency**: All repositories follow the same patterns
3. **Maintainability**: Changes to base operations affect all repositories
4. **Type Safety**: Full TypeScript support with generics
5. **Flexibility**: Easy to override or extend base methods

### 4. Example: Refactoring Existing Repository

Before:
```typescript
class UserRepositoryImplementation implements IUserRepository {
    async createUser(user: UserType): Promise<UserType> {
        const newUser = await User.create(user)
        return newUser
    }
    
    async findByEmail(email: String): Promise<UserType | null> {
        const getUser = await User.findOne({email : email});
        return getUser;
    }
}
```

After:
```typescript
class UserRepositoryImplementation extends BaseRepository<UserType> implements IUserRepository {
    constructor() {
        super(User);
    }
    
    async createUser(user: UserType): Promise<UserType> {
        return await this.create(user);
    }
    
    async findByEmail(email: String): Promise<UserType | null> {
        return await this.findByEmail(email.toString());
    }
}
```

### 5. Migration Guide

1. Import the BaseRepository
2. Extend BaseRepository instead of implementing interface directly
3. Add constructor with model parameter
4. Replace direct model calls with base repository methods
5. Keep custom business logic methods unchanged
6. Test thoroughly after migration 