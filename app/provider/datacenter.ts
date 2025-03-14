class dataCenter {
    private storage: Map<string, any>;

    constructor() {
        this.storage = new Map();
    }

    addData(key: string, value: any): void {
        this.storage.set(key, value);
    }

    getData<T>(key: string): T | undefined {
        return this.storage.get(key);
    }

    deleteData(key: string): boolean {
        return this.storage.delete(key);
    }

    getAllKeys(): string[] {
        return Array.from(this.storage.keys());
    }

    clear(): void {
        this.storage.clear();
    }
}

const DataCenter = new dataCenter();

export { DataCenter };
