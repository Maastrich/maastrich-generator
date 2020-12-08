import { Method } from './Method';

/**
 * type
 */
type Prototype = {
  key: string;
  type: string;
  required: boolean;
  defaultValue?: any;
};

type DatabaseInfo = {
  name: string,
  collection: string
};

/**
 * type
 */
type MethodInfo = {
  method: Method;
  database?: DatabaseInfo,
  auth: number;
  description: string,
  querytype: Prototype[];
  bodytype: Prototype[];
};

/**
 * type
 */
type Route = {
  route: string;
  path: string;
  methods: MethodInfo[];
};

type Config = Route[];

type Project = {
  _id: any;
  name: string;
  routes: Route[]
};

export {
 Config, MethodInfo, Prototype, Project,
};
