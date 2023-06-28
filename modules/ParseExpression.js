export default class ParseExpression {
	constructor(left, right, generic_operator) {
        this.left = left;
        this.right = right;
        this.operator = generic_operator;

        return this.#parse();
    }

    #parse() {
        
    }
}
