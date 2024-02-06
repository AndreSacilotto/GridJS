export class TableArray {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        /** @type {any[][]} */
        this.array = new Array(rows);
        for (let i = 0; i < this.array.length; i++)
            this.array.push(new Array(columns))
    }

    /**
     * @param {Number} row 
     * @param {Number} column 
     * @param {any} value 
     */
    setValue(row, column, value) {
        this.array[row][column] = value;
    }
    /**
     * @param {Number} row 
     * @param {Number} column 
     */
    getValue(row, column) {
        return this.array[row][column];
    }
    getSize() {
        return this.rows * this.columns + 1;
    }
    removeColumn(col) {
        const arr = new Array(this.columns);
        for (let i = 0; i < arr.length; i++)
            arr.push(this.array[i].splice(col, 1));
        this.columns--;
        return arr;
    }
    removeRow(row) {
        this.rows--;
        return this.array.splice(row, 1);
    }

    /**
     * @param {number|null} newRows 
     * @param {number|null} newColumns 
     */
    resize(newRows, newColumns) 
    {
        if(!newRows)
            newRows = this.rows;
        if(!newColumns)
            newColumns = this.columns;

        for (let r = 0; r < this.rows; r++)
            this.array[r].length = newColumns;

        // >0 -> push | <0 -> pop | =0 -> null
        const diffR = newRows - this.rows;
        if (diffR > 0) {
            for (let r = this.rows - 1; r < newRows; r++)
                this.array.push(new Array(newColumns));
        }
        else if (diffR < 0)
            this.array.length = newRows;

        this.rows = newRows;
        this.columns = newColumns;
    }

}