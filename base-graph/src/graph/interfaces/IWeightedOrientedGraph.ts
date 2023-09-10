/**
 * Интерфейс взвешенного ориентированного графа.
 */
export interface IWeightedOrientedGraph<T> {
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
     * Создает дугу от узла с меткой `a` к узлу с меткой `b`,
     * присваивая ей вес `weight`.
     * @param a начало ребра
     * @param b конец ребра
     * @param weight вес, который присвоить дуге
     *
     * @throws {@link @graph/error/GraphError#NodeNotExists}
     * Если узла с такой меткой не существует.
     *
     * @throws {@link @graph/error/GraphError#ConnectionAlreadyExists}
     * Если уже существует дуга от `a` до `b`.
     */
    connectNodes(a: string, b: string, weight: T): void;

    /**
     * Возвращает список смежности, соответствующий графу.
     */
    getAdjacencyList(): Map<string, [string, T][]>;
}