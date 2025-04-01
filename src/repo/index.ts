import { Model, Models, UpdateQuery } from "mongoose";

type TModel = Model<any, any>;

class Repository {
  private context: TModel;
  private query: { page: number; limit: number; searchFields: string[]; keyword: string; filters: any };

  constructor(context: TModel) {
    this.context = context;
    this.query = { page: 1, limit: 20, searchFields: [], keyword: "", filters: {} };
  }

  async create<T>(data: T) {
    const result = await this.context.create(data);
    return result.toObject() as T;
  }

  async update<T>(data: T, id: string) {
    return await this.context.findByIdAndUpdate(id, data as UpdateQuery<any>);
  }
  async findById<T>(id: string) {
    const result = await this.context.findById(id);
    return (result ? result.toObject() : result) as T;
  }
  async findOne<T>(query: { [key: string]: string | number } = {}) {
    const where = { ...query };
    const result = await this.context.findOne(where);
    return (result ? result.toObject() : result) as T;
  }

  async find<T>(query = this.query) {
    const where: any = {};
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    if (query.keyword) {
      where["$or"] = [
        ...query.searchFields.map((item) => ({ [item]: { $regex: query.keyword as string, $options: "i" } })),
      ];
    }

    if (query.filters) {
      for (let key in query.filters) {
        const value = query.filters[key];
        if (typeof value === "string" && value.trim()) {
          where[key] = { $regex: value, $options: "i" };
        } else where[key] = value;
      }
    }

    const result = await this.context.find(where).skip(skip).limit(limit);
    const totalCount = await this.context.countDocuments(where);
    return {
      page,
      limit,
      totalDocs: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: result.map((doc: any) => doc.toObject()) as T[],
    };
  }

  delete(id: number): Promise<number> {
    return this.context.findByIdAndDelete(id);
  }
}

export default Repository;
