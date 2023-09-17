export abstract class BaseGraph {
    abstract load(filename: string): void;
    abstract dump(filename: string): void;
}