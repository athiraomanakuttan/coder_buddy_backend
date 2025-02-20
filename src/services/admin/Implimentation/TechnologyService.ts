import { TechnologyType } from "../../../model/admin/technology";
import ITechnology from "../../../repositories/admin/ITechnology";
import { TechnologyOutput } from "../../../types/type";
import ITechnologyService from "../ITechologyService";


class TechnologyService implements ITechnologyService{
    private _technologyRepository : ITechnology
    constructor(technology: ITechnology){
        this._technologyRepository = technology
    }
    async createTechnology(title: string): Promise<TechnologyType | null> {
        return this._technologyRepository.createTechnology(title)
    }

    async getTechnologyByTitle(title: string): Promise<TechnologyType | null> {
        return this._technologyRepository.getTechnologyByTitle(title)
    } 

    async getAllTechnologies(page: number = 1, limit: number = 10): Promise<TechnologyOutput | null> {
        return this._technologyRepository.getAllTechnologies(page,limit)
    }
}

export default TechnologyService