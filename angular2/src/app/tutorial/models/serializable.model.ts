export interface Serializable {
    deserialize(input: any): this;
}