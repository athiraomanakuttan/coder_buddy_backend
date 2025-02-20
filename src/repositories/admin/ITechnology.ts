import { TechnologyType } from "../../model/admin/technology";
import { TechnologyOutput } from "../../types/type";

interface ITechnology{
createTechnology(title: string):Promise<TechnologyType | null >
getTechnologyByTitle(title: string):Promise< TechnologyType | null >
getAllTechnologies(page:number,limit:number):Promise< TechnologyOutput | null>
// updateTechnology(value:TechnologyType):Promise<TechnologyType | null >

}

export default ITechnology
