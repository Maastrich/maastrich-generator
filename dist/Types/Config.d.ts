/**
 * type
 */
declare type Prototype = {
    key: string;
    type: string;
    required: boolean;
    defaultValue?: any;
};
/**
 * type
 */
declare type MethodInfo = {
    method: 'Get' | 'Post' | 'Put' | 'Delete';
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
