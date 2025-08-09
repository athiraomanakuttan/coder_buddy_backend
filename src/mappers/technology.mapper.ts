import { TechnologyType } from '../model/admin/technology';
import { TechnologyDTO } from '../dto/technology.dto';

export function toTechnologyDTO(tech: TechnologyType): TechnologyDTO {
  return {
    title: tech.title,
    status: tech.status,
  };
}

