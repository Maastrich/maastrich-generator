import { Method } from './Method';
/**
 * type
 */
declare type Prototype = {
    key: string;
    type: string;
    required: boolean;
    defaultValue?: any;
};
declare type DatabaseInfo = {
    name: string;
    collection: string;
};
/**
 * type
 */
declare type MethodInfo = {
    method: Method;
    database: DatabaseInfo | undefined;
    auth: number;
    description: string;
    querytype: Prototype[];
    bodytype: Prototype[];
};
/**
 * type
 */
declare type Route = {
    route: string;
    path: string;
    methods: MethodInfo[];
};
declare type Config = Route[];
export { Config, MethodInfo, Prototype, };
