"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = exports.excludeFilterFields = void 0;
exports.excludeFilterFields = [
    "searchTerm",
    "sort",
    "fields",
    "page",
    "limit",
];
class QueryBuilder {
    constructor(modelQuery, query = {}) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.fromEntries(Object.entries(this.query).filter(([key]) => !exports.excludeFilterFields.includes(key)));
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searchableFields) {
        const searchTerm = this.query?.searchTerm;
        if (searchTerm && searchableFields.length > 0) {
            const conditions = searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            }));
            this.modelQuery = this.modelQuery.find({ $or: conditions });
        }
        return this;
    }
    sort() {
        const sortBy = this.query?.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    fields() {
        const fields = this.query?.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        const page = Math.max(Number(this.query?.page) || 1, 1);
        const hasLimit = this.query?.limit !== undefined;
        const limit = hasLimit ? Math.max(Number(this.query.limit), 1) : null;
        if (limit) {
            const skip = (page - 1) * limit;
            this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        }
        return this;
    }
    build(populateFields = []) {
        let query = this.modelQuery;
        for (const field of populateFields) {
            query = query.populate(field.path, field.select || "");
        }
        return query;
    }
    async getMeta() {
        const total = await this.modelQuery.model.countDocuments();
        const page = Math.max(Number(this.query?.page) || 1, 1);
        const hasLimit = this.query?.limit !== undefined;
        const limit = hasLimit ? Math.max(Number(this.query.limit), 1) : 10;
        const totalPage = Math.ceil(total / limit);
        return { page, limit, total, totalPage };
    }
}
exports.QueryBuilder = QueryBuilder;
