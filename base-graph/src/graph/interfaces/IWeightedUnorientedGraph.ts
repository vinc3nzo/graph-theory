/**
 * Интерфейс взвешенного неориентированного графа.
 */
export interface IWeightedUnorientedGraph<T> {
    /**
     * Добавляет новый узел в граф.
     * @param label метка нового узла
     *
     * @throws {@link @graph/error/GraphError#NodeAlreadyExists}
     * Если узел с данной меткой уже существует.
     */
    addNode(label: string): void;

    /**
     * Удаляет узел из графа.
     * @param label метка узла
     *
     * @throws {@link @graph/error/GraphError#NodeNotExists}
     * Если узла с такой меткой не существует.
     */
    removeNode(label: string): void;

    /**
     * Создает ребро между узлами с метками `a` и `b`,
     * присваивая ему вес `weight`.
     * @param a начало ребра
     * @param b конец ребра
     * @param weight вес, который присвоить ребру
     *
     * @throws {@link @graph/error/GraphError#NodeNotExists}
     * Если узла с такой меткой не существует.
     *
     * @throws {@link @graph/error/GraphError#ConnectionAlreadyExists}
     * Если уже существует ребро между `a` и `b`.
     */
    connectNodes(a: string, b: string, weight: T): void;

    /**
     * Возвращает список смежности, соответствующий графу.
     */
    getAdjacencyList(): Map<string, [string, T][]>;
}