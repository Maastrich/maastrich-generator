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
    database?: DatabaseInfo;
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
declare type Project = {
    _id: any;
    name: string;
    routes: Route[];
};
export { Config, MethodInfo, Prototype, Project, };
