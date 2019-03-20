/*! gibernate - v0.1.0 - 2019-03-18 04:02:58 */
class CacheL2 {
    increment: number;
    minChangedIndex: number;
    maxChangedIndex: number;
    items: EntityCollection;

    updates: EntityCollection;
    inserts: Entity[];
    deletes: EntityCollection;

    private updateCount: number;
    private insertCount: number;
    private deleteCount: number;

    private _indexes: {
        [field: string]: Index
    };

    constructor(private options: Options) {
        this.increment = -1;
        this.resetChanges();
    }

    resetChanges() {
        this.minChangedIndex = undefined;
        this.maxChangedIndex = undefined;

        this.updateCount = 0;
        this.insertCount = 0;
        this.deleteCount = 0;

        this.updates = new EntityCollection();
        this.inserts = [];
        this.deletes = new EntityCollection();
    }

    isInsertOnly() {
        return this.insertCount > 0 && this.updateCount == 0 && this.deleteCount == 0;
    }

    hasChanges() {
        return this.insertCount > 0 || this.updateCount > 0 || this.deleteCount > 0;
    }

    private indexesEnabled() {
        return this.options.index == true;
    }

    private indexes() {
        if (!this.indexesEnabled())
            return null;
        if (!this._indexes)
            this._indexes = {};
        return this._indexes;
    }

    private updateIndexes(item: Entity) {
        if (!this.indexesEnabled())
            return;
        for (let field in item) {
            this.updateIndex(field, item);
        }
    }

    private updateIndex(field: string, newValue: Entity, oldValue?: Entity) {
        if (!this.indexesEnabled())
            return null;
            
        const indexes = this.indexes();
        const fieldIndex = indexes[field] || (indexes[field] = new Index());

        if (oldValue)
            fieldIndex.delete(oldValue[field], oldValue);

        if (newValue)
            fieldIndex.update(newValue[field], newValue);

        return fieldIndex;
    }

    setItems(items: Entity[]) {
        if (!items) return;

        this.items = new EntityCollection();

        for (let i of items) {
            this.items.update(i);
            this.updateIndexes(i);

            if (this.increment == null)
                this.increment = i.__index;
            else
                this.increment = Math.max(this.increment, i.__index);
        }
    }

    private updateChangedIndex(i: number) {
        this.minChangedIndex = this.minChangedIndex == undefined ? i : Math.min(this.minChangedIndex, i);
        this.maxChangedIndex = this.maxChangedIndex == undefined ? i : Math.max(this.maxChangedIndex, i);
    }

    save(obj: Entity) {
        if (!obj) return;

        if (obj.__index >= 0) {
            // update
            this.updates.update(obj);
            this.updateChangedIndex(obj.__index);
            if (this.items)
                this.items.update(obj);
            this.updateCount++;
            //todo update index
        } else {
            // insert
            this.inserts.push(obj);
            if (this.items) {
                this.increment++;
                obj.__index = this.increment;
                this.items.update(obj);
                //todo update index
            }
            this.insertCount++;
        }
    }

    remove(obj: Entity) {
        if (!obj || !(obj.__index >= 0)) return;

        this.deletes.update(obj);

        if (this.items)
            this.items.delete(obj.__index);
        //todo update index
    }

    private values() {
        return this.items.values();
    }

    findAll() {
        return this.values();
    }

    find(filter: Filter) {
        if (filter == null) return [];

        if (this.indexesEnabled()) {
            const indexes = this.indexes();

            return Object.keys(filter)
                .map(f => indexes[f] ? indexes[f].get(filter[f]) : new EntityCollection())
                .reduce((res, cur) => {
                    return EntityCollection.intersect(res, cur);
                })
                .values();
        }

        return this.values().filter(i => this.applyFilter(i, filter));
    }

    findOne(filter: Filter) {
        const findResult = this.find(filter);

        if (findResult.length > 1)
            throw new Error(`The result contains more than 1 element (${findResult.length})`);

        return findResult[0];
    }

    private applyFilter(entity: Entity, filter: Filter) {
        let apply = true;
        for (let field in filter) {
            if (filter[field] != entity[field]) {
                apply = false;
                break;
            }
        }
        return apply;
    }

}
class Entity {
    __index?: number;
    [field: string]: any;
}

class EntityCollection {
    private _items: { [index: number]: Entity };

    constructor() {
        this._items = {};
    }

    values() {
        return Object.values(this._items);
    }

    indexes() {
        return Object.keys(this._items);
    }

    get(index: number) {
        return this._items[index];
    }

    update(obj: Entity) {
        this._items[obj.__index] = obj;
    }

    delete(index: number) {
        delete this._items[index];
    }

    static intersect(x: EntityCollection, y: EntityCollection) {
        if (x == null || y == null) return null;

        const result = new EntityCollection();

        for (let item of x.values()) {
            if (y.get(item.__index))
                result.update(item);
        }

        return result;
    }
}

class EntitySession {

    private _types: { [type: string]: Repository };

    constructor(private options?: SessionOptions) {
        this.options = new SessionOptions(options);
        this._types = {};
    }

    getRepository(name: string) {
        if (this._types[name])
            return this._types[name];

        const repoOptions = SessionOptions.getEntityOptions(this.options, name);
        this._types[name] = new Repository(repoOptions);
        return this._types[name];
    }
}

class Filter {
    [field: string]: any;
}

class Index {
    private _data: { [value: string]: EntityCollection };

    constructor() {
        this._data = {};
    }

    items(key: any) {
        return this.get(key).values();
    }

    get(key: any): EntityCollection {
        const strKey = JSON.stringify(key);
        return this._data[strKey] || (this._data[strKey] = new EntityCollection());
    }

    update(key: any, obj: Entity) {
        const collection = this.get(key);
        collection.update(obj);
    }

    delete(key: any, obj: Entity) {
        const collection = this.get(key);
        collection.delete(obj.__index);
    }
}

class Mapper {
    private _options: Options;
    private _fields: FieldOptions[];
    private _headers: string[];

    constructor(options: {
        options: Options,
        headers: string[]
    }) {
        this._options = options.options;
        this._headers = options.headers;

        this._fields = this.fields();
    }

    private fields() {
        if (this._fields !== undefined) return this._fields;

        if (!this._options.fields) {
            if (!this._headers)
                throw new Error(`Unable to get fields list`);

            this._fields = this._headers.map((h, i) => {
                const fld: FieldOptions = {
                    name: h,
                    columnIndex: i,
                    columnName: h
                };
                return fld;
            });
            return this._fields;
        }

        let headerMap: { [name: string]: number; } = null;
        if (this._options.header && this._headers)
            headerMap = this._headers.reduce((prev, h, i) => {
                prev[h] = i;
                return prev;
            }, {})

        this._fields = this._options.fields.map((fld, i) => {

            if (fld.columnIndex == null) {
                if (!fld.columnName)
                    fld.columnIndex = i;
                else {
                    const ind = headerMap[fld.columnName];
                    if (ind == null)
                        throw new Error(`Column '${fld.columnName}' is not found on data sheet`);
                    fld.columnIndex = ind;
                }
            }

            fld.columnName = this._headers ? this._headers[fld.columnIndex] : null;
            fld.name = fld.name || fld.columnName;

            if (!fld.name)
                throw new Error(`Unable to get field name with index ${fld.columnIndex}`);

            if (fld.readonly == null)
                fld.readonly = false;

            return fld;
        });
        return this._fields;
    }

    private mapFieldToObject(field: FieldOptions, row: Object[], target: Entity) {
        let newValue = row[field.columnIndex];

        if (newValue == "" && field.default != null)
            newValue = field.default;

        if (target[field.name] != newValue) {
            target[field.name] = newValue;
            return true;
        }
        return false;
    }

    private mapFieldToRow(field: FieldOptions, obj: Entity, target: Object[]) {
        if (field.readonly)
            return false;

        const newValue = field.formula ? field.formula : obj[field.name];
        if (target[field.columnIndex] != newValue) {
            target[field.columnIndex] = newValue;
            return true;
        }
        return false;
    }

    mapToObject(row: Object[], index: number): Entity {
        let result: Entity = { __index: index };
        result = this.fields().reduce((res, fld) => {
            this.mapFieldToObject(fld, row, res);
            return res;
        }, result);

        return result;
    }

    mapToRow(obj: Entity, currentRow?: Object[]): { value: Object[], changed: boolean } {
        let changed = false;
        const newRow = currentRow ? currentRow.slice(0) : [];
        const result = this.fields().reduce((res, fld) => {
            const fieldChanged = this.mapFieldToRow(fld, obj, res);
            if (fieldChanged)
                changed = true;
            return res;
        }, newRow);

        return { value: result, changed: changed };
    }

    formulaColumns(rowsCount: number) {
        const result: string[][][] = [];
        for (let field of this.fields()) {
            if (field.formula != null) {
                const column: string[][] = [];
                for (let i = 0; i < rowsCount; i++)
                    column[i] = [field.formula];

                result[field.columnIndex] = column;
            } else
                result[field.columnIndex] = null;
        }
        return result;
    }
}

class Repository {
    private _options: Options;

    private _table: Table;
    private _mapper: Mapper;
    private _cache: CacheL2;

    constructor(options: Options) {
        this._options = new Options(options);
        this._table = new Table(options);
    }

    private mapper() {
        if (this._mapper !== undefined) return this._mapper;

        this._mapper = new Mapper({
            options: this._options,
            headers: this._table.headers()
        });
        return this._mapper;
    }

    static create(options?: Options) {
        return new Repository(options);
    }

    private cache() {
        if (this._cache) return this._cache;
        this._cache = new CacheL2(this._options);
        return this._cache;
    }

    private initCache() {
        const cache = this.cache();

        if (!cache.items) {
            const values = this._table.values();
            const mapper = this.mapper();
            const items = values.map((row, i) => mapper.mapToObject(row, i));
            cache.setItems(items);
        }

        return cache;
    }

    /**
     * Find all objects
     */
    findAll() {
        return this.initCache().findAll();
    }

    /**
     * Find all objects 
     */
    find(filter: Filter) {
        return this.initCache().find(filter);
    }

    /**
     * Find all objects
     * 
     * @param filter search criteria
     */
    findOne(filter: Filter) {
        return this.initCache().findOne(filter);
    }

    save(obj: Entity) {
        this.cache().save(obj);
    }

    commit() {
        const cache = this.cache();

        if (!cache.hasChanges) return;

        const mapper = this.mapper();


        if (cache.isInsertOnly()) {

            const newRows = cache.inserts.map(i => mapper.mapToRow(i).value);
            this._table.append(newRows, []);
            cache.resetChanges();
            return;
        }

        const upsertRows = this._table.values();
        const upsertValues: Object[][] = []

        for (let i = cache.minChangedIndex;
            i <= Math.min(cache.maxChangedIndex, upsertRows.length - 1); i++) {
            const row = upsertRows[i];
            const update = cache.updates.get(i);
            if (update) {
                const mapResult = mapper.mapToRow(update, row);
                const newRow = mapResult.changed ? mapResult.value : row;

                upsertValues.push(newRow);
            }
        }

        const inserts = cache.inserts.map(i => mapper.mapToRow(i).value);
        upsertValues.concat(inserts);

        this._table
            .upsert(upsertValues, cache.minChangedIndex, []);
        cache.resetChanges();
    }

}




class Table {
    private _options: Options;
    private _headers: string[];
    private _values: Object[][];

    private _storageMeta: {
        dataRange: GoogleAppsScript.Spreadsheet.Range;
        headers?: string[];
        columnsCount: number;
        rowsCount: number;
    };

    constructor(options: Options) {
        this._options = new Options(options);
    }

    private getDataRangeGreedy() {
        const offsetRange = this._options.sheet.getRange(this._options.offsetA1);
        const sheetDataRange = this._options.sheet.getDataRange();
        const firstRow = offsetRange.getRow();
        const firstColumn = offsetRange.getColumn();
        const lastRow = sheetDataRange.getLastRow();
        const lastColumn = sheetDataRange.getLastColumn();

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        if (numRows < 1 || numColumns < 1
            //empty sheet case
            || (numRows == 1 && numColumns == 1 && offsetRange.getCell(1, 1).isBlank())) {
            return {
                dataRange: null,
                columnsCount: 0,
                rowsCount: 0
            };
        }

        return {
            dataRange: offsetRange.offset(0, 0, numRows, numColumns),
            columnsCount: numColumns,
            rowsCount: numRows
        }
    }

    private getDataRangeLazy() {
        const sheet = this._options.sheet;
        const offsetRange = sheet.getRange(this._options.offsetA1);

        function getLastRow(startRow: number, startColumn: number) {
            var rowIdx = startRow + 1;

            while (sheet.getRange(rowIdx, startColumn).getValue() != "") {
                rowIdx += 1;
            }

            return rowIdx - 1;
        }

        function getLastColumn(startRow: number, startColumn: number) {
            var columnIdx = startColumn + 1;

            while (sheet.getRange(startRow, columnIdx).getValue() != "") {
                columnIdx += 1;
            }

            return columnIdx - 1;
        }

        const firstRow = offsetRange.getRow();
        const firstColumn = offsetRange.getColumn();
        const lastRow = getLastRow(firstRow, firstColumn);
        const lastColumn = getLastColumn(firstRow, firstColumn);

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        const sheetDataRange = this._options.sheet
            .getRange(firstRow, firstColumn, numRows, numColumns);

        if (numRows < 1 || numColumns < 1
            //empty sheet case
            || (numRows == 1 && numColumns == 1 && sheetDataRange.getCell(1, 1).isBlank())) {
            return {
                dataRange: null,
                columnsCount: 0,
                rowsCount: 0
            };
        }
        return {
            dataRange: offsetRange.offset(0, 0, numRows, numColumns),
            columnsCount: numColumns,
            rowsCount: numRows
        }
    }

    private storageMeta() {
        if (this._storageMeta !== undefined)
            return this._storageMeta;

        this._storageMeta = this._options.rangeScanLazy
            ? this.getDataRangeLazy()
            : this.getDataRangeGreedy();

        return this._storageMeta;
    }

    values() {
        if (this._values !== undefined)
            return this._values;

        const meta = this.storageMeta();
        if (!meta.dataRange)
            return (this._values = []);

        const data = meta.dataRange.getValues();
        const headers = this._options.header ? data.shift().map(h => h.toString()) : null;
        this._headers = this._headers || headers;
        this._values = data;

        return this._values;
    }

    headers() {
        if (this._headers !== undefined)
            return this._headers;

        if (!this._options.header)
            return (this._headers = null);

        const meta = this.storageMeta();
        if (!meta.dataRange)
            return (this._headers = null);

        this._headers = meta.dataRange.offset(0, 0, 1, meta.columnsCount).getValues()[0].map(h => h.toString());
        return this._headers;
    }

    private writeFormulas(range: GoogleAppsScript.Spreadsheet.Range, formulaSections: string[][][]) {
        if (!formulaSections || formulaSections.length == 0)
            return;

        for (let i = 0; i < formulaSections.length; i++) {
            const data = formulaSections[i];
            if (!data) continue;
            range.offset(0, i, range.getNumRows(), data[0].length).setFormulasR1C1(data);
        }
    }

    append(rows: Object[][], formulaSections: string[][][]) {
        if (!rows || !(rows.length > 0)) return;
        const meta = this.storageMeta();
        this.upsert(rows, meta.rowsCount - (this._options.header ? 1 : 0), formulaSections);
    }

    upsert(rows: Object[][], startIndex: number, formulaSections: string[][][]) {
        if (!rows || !(rows.length > 0) || startIndex < 0) return;

        const meta = this.storageMeta();
        const rowOffset = startIndex + (this._options.header ? 1 : 0);

        if (rowOffset > meta.rowsCount)
            throw new Error('Insert produces blank rows');

        const range = meta.dataRange.offset(rowOffset, 0, rows.length, meta.columnsCount);
        range.setValues(rows);
        this.writeFormulas(range, formulaSections);
        meta.rowsCount = Math.max(rowOffset + rows.length, meta.rowsCount);
        meta.dataRange = meta.dataRange.offset(0, 0, meta.rowsCount, meta.columnsCount);
    }
}

class FieldOptions {
    name?: string;
    columnIndex?: number;
    columnName?: string;
    formula?: string;
    readonly?: boolean;
    default?: any;
}

class Options {

    header?: boolean;
    offsetA1?: string;

    /**
     * Set to 'true' if sure that first row and first column of dataset do not contain empty cells. Lazy scan strategy is much faster than greedy one. Default is false
     */
    rangeScanLazy?: boolean;

    /**
     * Field indexing toggle
     */
    index?: boolean;

    spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;
    sheetName?: string;
    sheet?: GoogleAppsScript.Spreadsheet.Sheet;

    fields?: FieldOptions[];

    constructor(options?: Options) {
        if (options)
            Object.assign(this, options);

        this.header = this.header != null ? this.header : true;
        this.offsetA1 = this.offsetA1 || "A1";
        this.index = this.index != null ? this.index : true;
        this.rangeScanLazy = this.rangeScanLazy != null ? this.rangeScanLazy : false;
        this.spreadsheet = this.spreadsheet || SpreadsheetApp.getActive();

        if (this.sheetName == null) {
            if (this.sheet == null)
                throw new Error(`Neither the sheet name nor the sheet specified`);

            this.sheetName = this.sheet.getName();
        }

        this.sheet = this.sheet || this.spreadsheet.getSheetByName(this.sheetName);
    }

}



class SessionOptions {

    defaults?: Options;
    entities?: {
        [entity: string]: Options;
    };

    constructor(options?: SessionOptions) {
        if (options)
            Object.assign(this, options);

        this.defaults = this.defaults || {};
        this.defaults.spreadsheet = this.defaults.spreadsheet || SpreadsheetApp.getActive();

        if (this.entities) {
            for (let entity in this.entities) {
                const opts = this.entities[entity];

                if (opts.sheet == null && !opts.sheetName)
                    opts.sheetName = entity;

                opts.spreadsheet = opts.spreadsheet || this.defaults.spreadsheet;
                opts.rangeScanLazy = opts.rangeScanLazy == null
                    ? this.defaults.rangeScanLazy
                    : opts.rangeScanLazy;
                opts.index = opts.index == null ? this.defaults.index : opts.index;

                this.entities[entity] = opts;
            }
        }
    }

    static getEntityOptions(options: SessionOptions, name: string) {
        if (options.entities) {
            const defined = options.entities[name];

            if (defined)
                return defined;
        }
        
        const sheet = options.defaults.spreadsheet.getSheetByName(name);

        if (!sheet) return null;

        return {
            ...options.defaults,
            sheetName: name,
            sheet: sheet
        };
    }
}
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

if (!Object.values) {
  Object.values = function values(O) {
    return Object.keys(O).map(k => O[k]);
  };
}

if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {

    // Шаги 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Шаги 3-5.
    var len = O.length >>> 0;

    // Шаги 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Шаг 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Шаги 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;

    // Шаг 11.
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Шаг 12.
    while (k < final) {
      O[k] = value;
      k++;
    }

    // Шаг 13.
    return O;
  };
}