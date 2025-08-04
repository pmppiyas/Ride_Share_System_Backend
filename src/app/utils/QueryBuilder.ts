import { Query } from "mongoose";

export const excludeFilterFields = [
  "searchTerm",
  "sort",
  "fields",
  "page",
  "limit",
];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string> = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = Object.fromEntries(
      Object.entries(this.query).filter(
        ([key]) => !excludeFilterFields.includes(key)
      )
    );

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm && searchableFields.length > 0) {
      const conditions = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));

      this.modelQuery = this.modelQuery.find({ $or: conditions });
    }

    return this;
  }

  sort(): this {
    const sortBy = this.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build(): Query<T[], T> {
    return this.modelQuery
      .populate("driver", "-_id name phone")
      .populate("rider", "-_id name phone");
  }

  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const total = await this.modelQuery.model.countDocuments();
    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const totalPage = Math.ceil(total / limit);

    return { page, limit, total, totalPage };
  }
}
