import { Technology, TechnologyType } from "../../../model/admin/technology";
import { TechnologyOutput } from "../../../types/type";
import ITechnology from "../../admin/ITechnology";

class TechnologyRepository implements ITechnology{
    async createTechnology(title: string): Promise<TechnologyType | null> {
        const data =  await Technology.create({title})
        return data
    }

    async getTechnologyByTitle(title: string): Promise<TechnologyType | null> {
        const data = await Technology.findOne({title})
        return data
    }

    async getAllTechnologies(page: number, limit: number): Promise<TechnologyOutput | null> {
        const skip = (page -1) * limit
        const data = await Technology.find().sort({createdAt:-1}).skip(skip).limit(limit)
        const totalRecords = await Technology.countDocuments()
        return {technologies: data, totalRecords}
    }

    async updateTechnology(id: string,data: TechnologyType): Promise<TechnologyType | null> {
        const updatedData = await Technology.findOneAndUpdate({_id:id},{$set:data},{new:true})
        return updatedData 
    }
}

export default TechnologyRepository