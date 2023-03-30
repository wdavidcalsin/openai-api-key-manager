export interface IRows {
  archived: boolean;
  cover: null;
  created_by: TedBy;
  created_time: Date;
  icon: null;
  id: string;
  last_edited_by: TedBy;
  last_edited_time: Date;
  object: string;
  parent: Parent;
  properties: Properties;
  url: string;
}

export interface TedBy {
  id: string;
  object: string;
}

export interface Parent {
  database_id: string;
  type: string;
}

export interface Properties {
  id: ID;
  value: Value;
  status: Value;
}

export interface ID {
  id: string;
  title: Title[];
  type: string;
}

export interface Title {
  annotations: Annotations;
  href: null;
  plain_text: string;
  text: Text;
  type: string;
}

export interface Annotations {
  bold: boolean;
  code: boolean;
  color: string;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
}

export interface Text {
  content: string;
  link: null;
}

export interface Value {
  id: string;
  rich_text: Title[];
  type: string;
}
