import { IQueriesParams } from 'src/users/interface/queriesParams.interface';
import { Repository } from 'typeorm';

export async function countTest<T>(repository: Repository<T>) {
  return await repository.count();
}

export function paginationList<T>(
  repository: Repository<T>,
  repositoryName: string,
  queries: IQueriesParams,
) {
  const { page, pageSize, s } = queries;
  const paginatedList = repository
    .createQueryBuilder(`${repositoryName}`)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (s) {
    paginatedList.andWhere(`${repositoryName}.name ILIKE :searchTerm`, {
      searchTerm: `%${s}%`,
    });
  }

  return paginatedList;
}

export async function checkExisted<T>(
  repository: Repository<T>,
  args: { key: string; value: string },
) {
  const result = await repository
    .createQueryBuilder(`${repository.metadata.name}`)
    .where(`${repository.metadata.name}.${args.key} = :value`, {
      value: args.value,
    })
    .withDeleted()
    .getOne();

  return result;
}
