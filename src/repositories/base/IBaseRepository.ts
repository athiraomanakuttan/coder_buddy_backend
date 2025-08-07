export interface IBaseRepository<T> {
    // Create operations
    create(data: T): Promise<T>;
    createMany(data: T[]): Promise<T[]>;
    
    // Read operations
    findById(id: string): Promise<T | null>;
    findByEmail(email: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    findOne(filter: any): Promise<T | null>;
    findMany(filter: any, options?: {
        skip?: number;
        limit?: number;
        sort?: any;
        select?: string;
    }): Promise<T[]>;
    
    // Update operations
    updateById(id: string, data: Partial<T>): Promise<T | null>;
    updateByEmail(email: string, data: Partial<T>): Promise<T | null>;
    updateOne(filter: any, data: Partial<T>): Promise<T | null>;
    updateMany(filter: any, data: Partial<T>): Promise<number>;
    
    // Delete operations
    deleteById(id: string): Promise<boolean>;
    deleteByEmail(email: string): Promise<boolean>;
    deleteOne(filter: any): Promise<boolean>;
    deleteMany(filter: any): Promise<number>;
    
    // Count operations
    count(filter?: any): Promise<number>;
    exists(filter: any): Promise<boolean>;
    
    // Aggregation operations
    aggregate(pipeline: any[]): Promise<any[]>;
} 