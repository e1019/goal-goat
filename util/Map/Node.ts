class Node {
    private _nextNode: Node = null;
    public get nextNode(){ return this._nextNode; }

    public insert(node: Node){
        if(node.nextNode) throw new Error("You may not insert a node which already belongs to another list!");
        if(this.nextNode){
            node.insert(this.nextNode);
        }
        this._nextNode = node;
    }

    public getTail(): Node {
        let currNode: Node = this;
        while(currNode.nextNode) currNode = currNode.nextNode;

        return currNode;
    }
};

export default Node;



