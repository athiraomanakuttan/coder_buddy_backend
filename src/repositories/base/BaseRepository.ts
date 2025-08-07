import { Model, Document } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // Create operations
    async create(data: T): Promise<T> {
        return await this.model.create(data);
    }

    async createMany(data: T[]): Promise<T[]> {
        return await this.model.insertMany(data);
    }

    // Read operations
    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async findByEmail(email: string): Promise<T | null> {
        return await this.model.findOne({ email });
    }

    async findAll(): Promise<T[]> {
        return await this.model.find();
    }

    async findOne(filter: any): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findMany(filter: any, options?: {
        skip?: number;
        limit?: number;
        sort?: any;
        select?: string | object;
    }): Promise<T[]> {
        let query = this.model.find(filter);

        if (options?.skip) {
            query = query.skip(options.skip);
        }

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.sort) {
            query = query.sort(options.sort);
        }

        // if (options?.select) {
        //     query = query.select(options.select);
        // }

        return await query.exec() as T[];
    }

    // Update operations
    async updateById(id: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async updateByEmail(email: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate({ email }, data, { new: true });
    }

    async updateOne(filter: any, data: Partial<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, { new: true });
    }

    async updateMany(filter: any, data: Partial<T>): Promise<number> {
        const result = await this.model.updateMany(filter, data);
        return result.modifiedCount;
    }

    // Delete operations
    async deleteById(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }

    async deleteByEmail(email: string): Promise<boolean> {
        const result = await this.model.findOneAndDelete({ email });
        return result !== null;
    }

    async deleteOne(filter: any): Promise<boolean> {
        const result = await this.model.findOneAndDelete(filter);
        return result !== null;
    }

    async deleteMany(filter: any): Promise<number> {
        const result = await this.model.deleteMany(filter);
        return result.deletedCount;
    }

    // Count operations
    async count(filter?: any): Promise<number> {
        return await this.model.countDocuments(filter || {});
    }

    async exists(filter: any): Promise<boolean> {
        const count = await this.model.countDocuments(filter);
        return count > 0;
    }

    // Aggregation operations
    async aggregate(pipeline: any[]): Promise<any[]> {
        return await this.model.aggregate(pipeline);
    }
} 